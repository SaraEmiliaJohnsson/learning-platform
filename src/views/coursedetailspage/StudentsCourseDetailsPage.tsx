import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Assignments, Lesson, LinkResource, ReadingTip } from "../../types";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import './StudentCourseDetailsPage.css';



const StudentCourseDetailsPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [assignments, setAssignments] = useState<Assignments[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [readingTips, setReadingTips] = useState<ReadingTip[]>([]);
    const [links, setLinks] = useState<LinkResource[]>([]);
    const [courseTitle, setCourseTitle] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!courseId) {
                console.error('Course ID is undefined');
                return;
            }
            try {
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (courseDoc.exists()) {
                    setCourseTitle(courseDoc.data().title);

                    const assignmentsSnapshot = await getDocs(collection(db, `courses/${courseId}/assignments`));
                    const assignmentsData: Assignments[] = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignments));
                    setAssignments(assignmentsData);

                    const lessonsSnapshot = await getDocs(collection(db, `courses/${courseId}/lessons`));
                    const lessonsData: Lesson[] = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
                    setLessons(lessonsData);

                    const readingTipsSnapshot = await getDocs(collection(db, `courses/${courseId}/readingTips`));
                    const readingTipsData: ReadingTip[] = readingTipsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReadingTip));
                    setReadingTips(readingTipsData);

                    const linksSnapshot = await getDocs(collection(db, `courses/${courseId}/links`));
                    const linksData: LinkResource[] = linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LinkResource));
                    setLinks(linksData);
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Failed signing out', error);
        }
    }

    const handleBackClick = () => {
        navigate(-1);
    }

    return (
        <div className="student-course-details-wapper">
            <header className="student-course-details-header">
                <h2>{courseTitle}</h2>
                <button className="back-button" onClick={handleBackClick}>Tillbaka</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="student-course-details-main">
                <h3>Uppgifter</h3>
                <ul className="assignments-list">
                    {assignments.map((assignment) => (
                        <li key={assignment.id}>{assignment.title}</li>
                    ))}
                </ul>
                <h3>Kommande Lektioner</h3>
                <ul className="lessons-list">
                    {lessons.map((lesson) => (
                        <li key={lesson.id}>{lesson.title}</li>
                    ))}
                </ul>
                <h3>Tips på läsning</h3>
                <ul className="reading-tips-list">
                    {readingTips.map((tip) => (
                        <li key={tip.id}>{tip.title}</li>
                    ))}
                </ul>
                <h3>Länkar</h3>
                <ul className="links-list">
                    {links.map((link) => (
                        <li key={link.id}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a></li>
                    ))}
                </ul>
            </main>

        </div>
    );
}

export default StudentCourseDetailsPage;