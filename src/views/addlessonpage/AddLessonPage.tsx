import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import './AddLessonPage.css';



const AddLessonPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [courseTitle, setCourseTitle] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseTitle = async () => {
            if (!courseId) {
                console.error('Course ID was undefined');
                return;
            }
            try {
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (courseDoc.exists()) {
                    setCourseTitle(courseDoc.data()?.title || '');
                } else {
                    console.error('Course does not exist');
                }
            } catch (error) {
                console.error('Error fetching course title:', error);
            }
        };
        fetchCourseTitle();
    }, [courseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!courseId) {
                console.error('Course ID is undifined');
                return;
            }

            const lessonData = {
                title,
                date,
                description,
                ctreatedAt: new Date()
            };

            await addDoc(collection(db, `courses/${courseId}/lessons`), lessonData);
            navigate(`/course/${courseId}`);
        } catch (error) {
            console.error('Error adding lesson: ', error);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleToStartPage = () => {
        navigate('/teacher');
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Failed to sign out', error);
        }
    }

    return (
        <div className="add-lesson-wrapper">
            <header className="add-lesson-header">
                <h2>Lägg till lektion i {courseTitle}</h2>
                <button className="back-button" onClick={handleBackClick}>Tillbaka</button>
                <button className="start-page-button" onClick={handleToStartPage}>Startsida</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="add-lesson-main">
                <form className="form-container" onSubmit={handleSubmit}>
                    <label htmlFor="title">Titel:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <label htmlFor="date">Datum:</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    <label htmlFor="description">Beskrivning:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required ></textarea>
                    <button className="submit-button" type="submit">Lägg till Lektion</button>
                </form>
            </main>
        </div>
    )
}

export default AddLessonPage;