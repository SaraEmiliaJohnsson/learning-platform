import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../components/auth/AuthContext";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import './AddAssignmentsPage.css';



const AddAssignmentsPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId || !currentUser) return;

        try {
            await addDoc(collection(db, `courses/${courseId}/assignments`), {
                title,
                description,
                dueDate,
                createdBy: currentUser.uid,
                createdAt: new Date(),
            });
            navigate(`/course/${courseId}`);
        } catch (error) {
            console.error('Error adding assignment: ', error);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
            console.log('Utloggad');

        } catch (error) {
            console.error('Error signing out', error);
        }
    }



    return (
        <div className="add-assignments-wrapper">
            <header className="add-assignments-header">
                <h2>Lägg till uppgift</h2>
                <button className="header-button-teacher" onClick={handleBackClick}>Tillbaka</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="add-assignments-main">
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="title">
                                Titel:
                            </label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor="descpription">
                                Beskrivning
                            </label>
                            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor="dueDate">Slutdatum</label>
                            <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                        </div>
                        <button className="teacher-button" type="submit">Lägg till uppgift</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddAssignmentsPage;