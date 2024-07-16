import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Assignments, Student } from "../../types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { useAuth } from "../../components/auth/AuthContext";
import { signOut } from "firebase/auth";
import './CourseDetailsPage.css';
import { log } from "console";



const CourseDetailsPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { currentUser } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [assignments, setAssignments] = useState<Assignments[]>([]);
    const [courseTitle, setCourseTitle] = useState<String>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!courseId || !currentUser) {
                console.error("Course ID or currentUser is undefined");
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                console.log('User Data:', userDoc.data());

                if (userDoc.exists() && userDoc.data()?.role === 'teacher') {
                    const courseDoc = await getDoc(doc(db, 'courses', courseId));
                    if (courseDoc.exists()) {
                        setCourseTitle(courseDoc.data()?.title || '');

                        const studentIds = courseDoc.data()?.students || [];
                        const studentData: Student[] = [];

                        for (const studentId of studentIds) {
                            const studentDoc = await getDoc(doc(db, 'students', studentId));
                            if (studentDoc.exists()) {
                                studentData.push({ id: studentDoc.id, ...studentDoc.data() } as Student);
                            }
                        }

                        const assignmentsData: Assignments[] = [];
                        const studentSnapshot = await getDocs(collection(db, `courses/${courseId}/students`));
                        studentSnapshot.forEach((doc) => {
                            studentData.push({ id: doc.id, ...doc.data() } as Student);
                        });
                        const assignmentsSnapshot = await getDocs(collection(db, `courses/${courseId}/assignments`));
                        assignmentsSnapshot.forEach((doc) => {
                            assignmentsData.push({ id: doc.id, ...doc.data() } as Assignments);
                        });
                        setStudents(studentData);
                        setAssignments(assignmentsData);
                    } else {
                        console.error("Course does not exist");
                    }
                } else {
                    console.error("User is not a teacher or user data not found");
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };
        fetchCourseDetails();
    }, [courseId, currentUser]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
            console.log('Utloggad');

        } catch (error) {
            console.error('Failed to sign out', error);
        }
    }

    const handleBackClick = () => {
        navigate(-1);
    }

    return (
        <div className="course-details-wrapper">
            <header className="course-details-header">
                <h2>{courseTitle}</h2>
                <button className="header-button-teacher" onClick={() => { /* Funktion för att lägga till uppgift */ }}>Lägg till Uppgift</button>
                <button className="header-button-teacher" onClick={() => { /* Funktion för att lägga till lektion */ }}>Lägg till Lektion</button>
                <button className="header-button-teacher" onClick={handleBackClick}>Tillbaka</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="course-details-main">
                <h3>Deltagare</h3>
                <ul className="students-list">
                    {students.map((student) => (
                        <li key={student.id}>{student.name}</li>
                    ))}
                </ul>
                <h3>Uppgifter</h3>
                <ul className="assignments-list">
                    {assignments.map((assignment) => (
                        <li key={assignment.id}>{assignment.title}</li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default CourseDetailsPage;