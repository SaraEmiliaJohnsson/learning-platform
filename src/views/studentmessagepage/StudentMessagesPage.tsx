import { useEffect, useState } from "react";
import { useAuth } from "../../components/auth/AuthContext"
import { Message } from "../../types";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import './StudentMessegesPage.css';

const StudentMessagesPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentUser) return;

            try {
                const q = query(collection(db, 'messages'), where('recipients', 'array-contains', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const msgs: Message[] = [];
                querySnapshot.forEach((doc) => {
                    msgs.push({ id: doc.id, ...doc.data() } as Message);
                });
                setMessages(msgs);

                msgs.forEach(async (msg) => {
                    if (!msg.read) {
                        await updateDoc(doc(db, 'messages', msg.id), { read: true });
                    }
                });
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [currentUser]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out');
        };
    };

    return (
        <div className="student-messages-wrapper">
            <header className="student-messages-header">
                <h2>Meddelanden</h2>
                <button className="back-button" onClick={handleBackClick}>Tillbaka</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="student-messages-main">
                <ul className="student-messages-list">
                    {messages.map((message) => (
                        <li key={message.id}>
                            <h4>{message.title}</h4>
                            <p>{message.body}</p>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default StudentMessagesPage;
