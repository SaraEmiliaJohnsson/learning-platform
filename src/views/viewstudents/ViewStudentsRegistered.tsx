import { collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { db } from "../../components/firebase/FirebaseConfig";
import { Student } from "../../types";



const ViewStudentsRegistered: React.FC = () => {
    const [seeStudents, setSeeStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'students'));
                const studentsData: Student[] = [];
                querySnapshot.forEach((doc) => {
                    studentsData.push({ id: doc.id, ...doc.data() } as Student);
                });
                setSeeStudents(studentsData);
            } catch (error) {
                console.error('Error fetching students:', error);
            }

        }
        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Registrerade Elever</h2>
            <ul>
                {seeStudents.map((student) => (
                    <li key={student.id}>{student.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default ViewStudentsRegistered;