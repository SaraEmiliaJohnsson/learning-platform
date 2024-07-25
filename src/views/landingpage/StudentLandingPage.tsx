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
    const [unreadMessagesCount, setUnreadMessegesCount] = useState(0);
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

        const fetchUnreadMessagesCount = async () => {
            if (!currentUser) return;

            try {
                const q = query(collection(db, 'messages'), where('recipients', 'array-contains', currentUser.uid), where('read', '==', false));
                const querySnapshot = await getDocs(q);
                setUnreadMessegesCount(querySnapshot.size);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchCourses();
        fetchUnreadMessagesCount();
    }, [currentUser]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
            console.log('Utloggad');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const handleCourseClick = (courseId: string) => {
        navigate(`/student/course/${courseId}`);
    };

    const handleMessagesClick = () => {
        navigate('/student-message');
    };

    const handleCompletedCoursesClick = () => {
        navigate('/completed-courses');
    };


    return (
        <section className="student-landingpage-wrapper">
            <header className="landingpage-header">
                <h2>Studerande sidan</h2>
                <button className="header-button-student" onClick={handleCompletedCoursesClick}>Avslutade Kurser</button>
                <button className="header-button-student" onClick={handleMessagesClick}>Meddelanden {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="landingpage-main">
                <div className="ongoing-courses">
                    <h3>Pågående Kurser</h3>

                    {courses.map((course) => (
                        <div key={course.id} className="course-card" onClick={(() => handleCourseClick(course.id))}>
                            <h4>{course.title}</h4>
                            <p>{course.description}</p>
                        </div>
                    ))}

                </div>

            </main>
        </section>
    );
}

export default StudentLandingPage;
