import { addDoc, collection, doc, getDocs, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { useAuth } from "../../components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import './TeacherMessagePage.css';
import { Student } from "../../types";



const TeacherMessagePage: React.FC = () => {
    const { currentUser } = useAuth();
    const [selectedRecipient, setSelectedRecipient] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [sendToAll, setSendToAll] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'students'));
                const studentData: Student[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    email: doc.data().email,
                }));
                setStudents(studentData);
            } catch (error) {
                console.error('Error fetching students', error);
            }
        };
        fetchStudents();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            console.error('User is not logged in');
            return;
        }

        try {
            const recipients = sendToAll ? students : [selectedRecipient];

            await addDoc(collection(db, 'messages'), {
                sender: currentUser.uid,
                recipients: recipients,
                title: title,
                body: body,
                timestamp: Timestamp.now(),
                read: false,
            });


            setSelectedRecipient('');
            setTitle('');
            setBody('');
        } catch (error) {
            console.error('Error sending message: ', error);
        }
    };

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
        <div className="send-message-wrapper">
            <header className="send-message-header">
                <h2>Skicka meddelande</h2>
                <button className="back-button" onClick={handleBackClick}>Tillbaka</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="send-message-main">
                <form onSubmit={handleSubmit} className="form-container">
                    <label htmlFor="recipient">Mottagare:</label>

                    <select id="recipient" value={selectedRecipient} onChange={(e) => setSelectedRecipient(e.target.value)}>
                        <option value="">Välj mottagare</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="title">Titel:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <label htmlFor="body">Meddelande:</label>
                    <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} required></textarea>
                    <section className="send-to-all">
                        <label htmlFor="sendToAll">Klicka i för att skicka till alla elever</label>
                        <input className="sendToAll" type="checkbox" id="sendToAll" checked={sendToAll} onChange={(e) => setSendToAll(e.target.checked)} />
                    </section>
                    <button type="submit" className="send-button">Skicka</button>
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

export default TeacherMessagePage;