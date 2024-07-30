import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import './AddLinkPage.css';


const AddLinkPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId || !currentUser) {
            console.error('Course ID or currentUser is undefined');
            return;
        }
        try {
            await addDoc(collection(db, `courses/${courseId}/links`), {
                title: title,
                url: url,
                addedBy: currentUser.uid
            });
            setTitle('');
            setUrl('');
        } catch (error) {
            console.error('Error adding link:', error);
        }
    }

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Failed to sign out', error);
        };
    };


    return (
        <div className="add-link-wrapper">
            <header className="add-link-header">
                <h2>Lägg till ett länktips</h2>
                <button className="back-button" onClick={handleBackClick}>Tillbaka</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="add-link-main">
                <form onSubmit={handleSubmit} className="form-container">
                    <label htmlFor="title">Titel:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <label htmlFor="url">URL:</label>
                    <input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
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

export default AddLinkPage;