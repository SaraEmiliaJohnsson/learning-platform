import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { Student, Course } from "../../types";
import { signOut } from "firebase/auth";
import './ViewStudentsRegistered.css';

interface StudentWithCourses extends Student {
    courses: Course[];
}

const ViewStudentsRegistered: React.FC = () => {
    const [studentsWithCourses, setStudentsWithCourses] = useState<StudentWithCourses[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentsAndCourses = async () => {
            try {
                const studentsSnapshot = await getDocs(collection(db, 'students'));
                const studentsData: StudentWithCourses[] = [];

                for (const studentDoc of studentsSnapshot.docs) {
                    const studentData = studentDoc.data() as Student;
                    const studentCourses: Course[] = [];

                    const coursesSnapshot = await getDocs(collection(db, 'courses'));
                    coursesSnapshot.forEach((courseDoc) => {
                        const courseData = courseDoc.data() as Course;
                        if (courseData.students && courseData.students.includes(studentDoc.id)) {
                            studentCourses.push({ ...courseData, id: courseDoc.id });
                        }
                    });

                    studentsData.push({ ...studentData, id: studentDoc.id, courses: studentCourses });
                }

                setStudentsWithCourses(studentsData);
            } catch (error) {
                console.error('Error fetching students and courses:', error);
            }
        };
        fetchStudentsAndCourses();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    const handleToStartPage = () => {
        navigate('/teacher');
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="view-students-wrapper">
            <header className="view-students-header">
                <h2>Registrerade Elever</h2>
                <button className="header-button-teacher" onClick={handleBackClick}>Tillbaka</button>
                <button className="start-page-button" onClick={handleToStartPage}>Startsida</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="view-students-main">
                <ul>
                    {studentsWithCourses.map((student) => (
                        <li key={student.id}>
                            {student.name}
                            <ul>
                                {student.courses.map((course) => (
                                    <li key={course.id}>{course.title}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default ViewStudentsRegistered;
