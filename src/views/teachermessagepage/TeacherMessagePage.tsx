import { addDoc, collection, doc, getDocs, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { useAuth } from "../../components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import './TeacherMessagePage.css';



const TeacherMessagePage: React.FC = () => {
    const { currentUser } = useAuth();
    const [recipient, setRecipient] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [students, setStudents] = useState<string[]>([]);
    const [sendToAll, setSendToAll] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'students'));
                const studentIds: string[] = querySnapshot.docs.map(doc => doc.id);
                setStudents(studentIds);
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
            const recipients = sendToAll ? students : [recipient];
            await Promise.all(recipients.map(async (rec) => {
                await addDoc(collection(db, 'messages'), {
                    sender: currentUser.uid,
                    recipients: recipients,
                    title: title,
                    body: body,
                    timestamp: Timestamp.now(),
                    read: false,
                });
            }));

            setRecipient('');
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
                    <input type="text" id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                    <label htmlFor="title">Titel:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <label htmlFor="body">Meddelande:</label>
                    <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} required></textarea>
                    <section className="send-to-all">
                        <label htmlFor="sendToAll">Skicka till alla elever</label>
                        <input type="checkbox" id="sendToAll" checked={sendToAll} onChange={(e) => setSendToAll(e.target.checked)} />
                    </section>
                    <button type="submit" className="send-button">Skicka</button>
                </form>
            </main>
        </div>
    )
}

export default TeacherMessagePage;