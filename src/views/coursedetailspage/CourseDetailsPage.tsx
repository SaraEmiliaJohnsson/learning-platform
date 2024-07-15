import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Assignments, Student } from "../../types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../components/firebase/FirebaseConfig";
import { useAuth } from "../../components/auth/AuthContext";



const CourseDetailsPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { currentUser } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [assignments, setAssignments] = useState<Assignments[]>([]);
    const [courseTitle, setCourseTitle] = useState<String>('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!courseId || !currentUser) {
                console.error("Course ID or currentUser is undefined");
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists() && userDoc.data()?.role === 'teacher') {
                    const courseDoc = await getDoc(doc(db, 'courses', courseId));
                    if (courseDoc.exists()) {
                        setCourseTitle(courseDoc.data().title);
                        const studentData: Student[] = [];
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

    return (
        <div className="course-details-wrapper">
            <header className="course-details-header">
                <h2>{courseTitle}</h2>
                <button onClick={() => { /* Funktion för att lägga till uppgift */ }}>Lägg till Uppgift</button>
                <button onClick={() => { /* Funktion för att lägga till lektion */ }}>Lägg till Lektion</button>
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