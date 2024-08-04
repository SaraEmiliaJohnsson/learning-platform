import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import './TeacherLandingPage.css';
import { useEffect, useState } from "react";
import { Course } from "../../types";
import { collection, doc, getDocs } from "firebase/firestore";



const TeacherLandingPage = () => {
    const [ongoingCourses, setOngoingCourses] = useState<Course[]>([]);
    const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'courses'));
                const ongoing: Course[] = [];
                const completed: Course[] = [];

                querySnapshot.forEach((doc) => {
                    const courseData = doc.data() as Omit<Course, 'id'>;
                    const course = { id: doc.id, ...courseData };

                    if (course.completed) {
                        completed.push(course);
                    } else {
                        ongoing.push(course);
                    }
                });
                setOngoingCourses(ongoing);
                setCompletedCourses(completed);

            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseClick = (courseId: string) => {
        navigate(`/course/${courseId}`);
    };

    const handleSendMessage = () => {
        navigate('/add-message');
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


    return (
        <section className="teacher-landingpage-wrapper">
            <header className="landingpage-header">
                <h2>Lärarens sida</h2>
                <button className="header-button-teacher" onClick={() => navigate('/add-course')}>Lägg till Kurs</button>
                <button className="header-button-teacher" onClick={() => navigate('/see-students')}>Registrerade Studenter</button>
                <button className="header-button-teacher" onClick={handleSendMessage}>Sckicka Meddelande</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="landingpage-main">
                <h3>Pågående Kurser</h3>
                <ul className="courses-list">
                    {ongoingCourses.map((course) => (
                        <li key={course.id} onClick={() => handleCourseClick(course.id)}>
                            {course.title}
                        </li>
                    ))}
                </ul>
                <h3>Avslutade Kurser</h3>
                <ul className="courses-list">
                    {completedCourses.map((course) => (
                        <li key={course.id} onClick={() => handleCourseClick(course.id)}>
                            {course.title}
                        </li>
                    ))}
                </ul>
            </main>
            <footer className="footer">
                <p>&copy; 2023 Your Learning Platform. All rights reserved.</p>
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-of-service">Terms of Service</a>
            </footer>
        </section>
    )
}

export default TeacherLandingPage;