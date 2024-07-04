import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import './StudentLandingPage.css';
import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/auth/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Course, Message } from "../../types";

const StudentLandingPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            if (!currentUser) return;

            try {
                const q = query(collection(db, 'courses'), where('students', 'array-contains', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const ongoing: Course[] = [];
                const completed: Course[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as Omit<Course, 'id'>;
                    const course = { id: doc.id, ...data };
                    if (course.completed) {
                        completed.push(course);
                    } else {
                        ongoing.push(course);
                    }
                });
                setCourses(ongoing);
                setCompletedCourses(completed);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        const fetchMessages = async () => {
            if (!currentUser) return;

            try {
                const q = query(collection(db, 'messages'), where('recipientId', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const msgs: Message[] = [];
                querySnapshot.forEach((doc) => {
                    msgs.push({ id: doc.id, ...doc.data() } as Message);
                });
                setMessages(msgs);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchCourses();
        // fetchMessages();
    }, [currentUser]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/login');
            console.log('Utloggad');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <section className="student-landingpage-wrapper">
            <header className="landingpage-header">
                <h2>Studerande sidan</h2>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="landingpage-main">
                <div>
                    <h3>Pågående Kurser</h3>
                    <ul>
                        {courses.map((course) => (
                            <li key={course.id}>{course.title}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Avslutade Kurser</h3>
                    <ul>
                        {completedCourses.map((course) => (
                            <li key={course.id}>{course.title}</li>
                        ))}
                    </ul>
                </div>
            </main>
        </section>
    );
}

export default StudentLandingPage;
