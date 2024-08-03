import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../components/auth/AuthContext"
import { useEffect, useState } from "react";
import { Course } from "../../types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import './CompletedCoursesPage.css';



const CompleatedCoursesPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompletedCourses = async () => {
            if (!currentUser) return;

            try {
                const q = query(
                    collection(db, 'courses'),
                    where('students', 'array-contains', currentUser.uid),
                    where('completed', '==', true)
                );
                const querySnapshot = await getDocs(q);
                const courses: Course[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Course));
                setCompletedCourses(courses);
            } catch (error) {
                console.error('Error fetching completed courses:', error);
            }
        };
        fetchCompletedCourses();
    }, [currentUser]);

    const handleBackClick = () => {
        navigate(-1);
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Failed to sign out', error);
        }
    }


    return (
        <div className="completed-courses-wrapper">
            <header className="completed-courses-header">
                <h2>Avslutade Kurser</h2>
                <button className="back-button" onClick={handleBackClick}>Tillbaka</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="completed-courses-main">
                <div className="completed-courses">
                    <h3>Avslutade kurser</h3>
                    {completedCourses.map(course => (
                        <div key={course.id} className="course-card">
                            <h4>{course.title}</h4>
                            <p>{course.description}</p>
                        </div>
                    ))}
                </div>

            </main>
            <footer className="footer">
                <p>&copy; 2023 Your Learning Platform. All rights reserved.</p>
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-of-service">Terms of Service</a>
            </footer>
        </div>
    );
}

export default CompleatedCoursesPage;