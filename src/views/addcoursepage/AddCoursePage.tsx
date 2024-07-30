import { addDoc, collection } from "firebase/firestore";
import { useState } from "react"
import { auth, db } from "../../components/firebase/FirebaseConfig";
import './AddCoursePage.css';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const AddCoursePage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleAddCourse = async () => {
        try {
            await addDoc(collection(db, 'courses'), {
                title,
                description,
                students: [],
                assignments: [],
            });
            setTitle('');
            setDescription('');
            console.log('Kurs tillagd');

        } catch (error) {
            console.error('Error adding course: ', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
            console.log('Utloggad');

        } catch (error) {
            console.error('Failed to sign out', error);
        }
    }

    const handleToStartPage = () => {
        navigate('/teacher');
    };

    const handleBackClick = () => {
        navigate(-1);
    };



    return (
        <div className="add-course-wrapper">
            <header className="teacher-header">
                <h2>Lärarens sida</h2>
                <button className="header-button-teacher" onClick={handleBackClick}>Tillbaka</button>
                <button className="start-page-button" onClick={handleToStartPage}>Startsida</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="add-course-main">
                <h2>Lägg till kurs</h2>
                <input id="course" type="text" placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea placeholder="Beskrivning" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <button className="add-course-button" onClick={handleAddCourse}>Lägg till Kurs</button>
            </main>
            <footer className="footer">
                <p>&copy; 2023 Your Learning Platform. All rights reserved.</p>
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-of-service">Terms of Service</a>
            </footer>
        </div>
    );
};

export default AddCoursePage;