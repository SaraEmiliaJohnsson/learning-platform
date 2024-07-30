import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import './AddReadingTipPage.css';



const AddReadingTipPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [courseTitle, setCourseTitle] = useState<string>('');

    useEffect(() => {
        const fetchCourseTitle = async () => {
            if (courseId) {
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (courseDoc.exists()) {
                    setCourseTitle(courseDoc.data()?.title || '');
                }
            }
        };
        fetchCourseTitle();
    }, [courseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId || !currentUser) {
            console.error('Course ID or current user is undefined');
            return;
        }
        try {
            await addDoc(collection(db, `courses/${courseId}/readingTips`), {
                title,
                author,
                description,
                createdBy: currentUser.uid,
                timestamp: new Date(),
            });
            setTitle('');
            setAuthor('');
            setDescription('');
        } catch (error) {
            console.error('Error adding reading tip:', error);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Failed to sign out', error);
        };
    };

    return (
        <div className="add-reading-tip-wrapper">
            <header className="add-reading-tip-header">
                <h2>Lägg till läsning tips till {courseTitle}</h2>
                <button className="back-button" onClick={handleBackClick}>Tillbaka</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="add-reading-tip-main">
                <form onSubmit={handleSubmit} className="form-container">
                    <label htmlFor="title">Titel:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="author">Författare:</label>
                    <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    <label htmlFor="description">Beskrivning:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    <button type="submit" className="submit-button">Lägg till</button>
                </form>
            </main>
            <footer className="footer">
                <p>&copy; 2023 Your Learning Platform. All rights reserved.</p>
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-of-service">Terms of Service</a>
            </footer>
        </div>
    )
}

export default AddReadingTipPage;