import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { db } from "../../components/firebase/FirebaseConfig";
import './AssignmentSubmissionsPage.css';




const AssignmentSubmissionsPage: React.FC = () => {
    const { courseId, assignmentId } = useParams<{ courseId: string, assignmentId: string }>();
    const [courseTitle, setCourseTitle] = useState<string>();
    const [submissions, setSubmissions] = useState<any[]>([]);

    useEffect(() => {
        const fetchSubissions = async () => {
            if (!courseId || !assignmentId) {
                console.error('Course ID or Assignment ID is undefined');
                return;
            }
            try {
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (courseDoc.exists()) {
                    const courseData = courseDoc.data();
                    setCourseTitle(courseData?.title || '');
                }
                const submissionsSnapshot = await getDocs(collection(db, `courses/${courseId}/assignments/${assignmentId}/responses`));
                const submissionsData = submissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSubmissions(submissionsData);
            } catch (error) {
                console.error('Error fetching submissions', error);
            }
        };
        fetchSubissions();
    }, [courseId, assignmentId]);

    const handleGradeSubmission = async (submissionId: string, feedback: string, grade: string) => {
        try {
            const submissionRef = doc(db, `courses/${courseId}/assignments/${assignmentId}/responses`, submissionId);
            await updateDoc(submissionRef, {
                feedback,
                grade,
                graded: true,
                feedbackTimestamp: new Date(),
            });
            alert('Submission graded successfully');
            setSubmissions(prev => prev.map(sub => sub.id === submissionId ? { ...sub, graded: true, feedback, grade } : sub));
        } catch (error) {
            console.error('Error grading submission', error);
        }
    };



    return (
        <div className="assignment-submissions-wrapper">
            <header className="assignment-submissions-header">
                <h2>{courseTitle}</h2>
                <button className="back-button">Tillbaka</button>
                <button className="logout-button">Logga ut</button>
            </header>
            <main className="assignment-submissions-main">
                <h2>Resultat på Uppgift</h2>
                <ul>
                    {submissions.map(submission => (
                        <li key={submission.id}>
                            <p>{submission.response}</p>
                            {!submission.graded ? (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const feedback = e.currentTarget.feedback.value;
                                    const grade = e.currentTarget.grade.value;
                                    handleGradeSubmission(submission.id, feedback, grade);
                                }}>
                                    <textarea name="feedback" placeholder="Bedömning.."></textarea>
                                    <input name="grade" placeholder="Betyg.." />
                                </form>
                            ) : (
                                <p>Rättad: {submission.grade} - {submission.feedback}</p>
                            )}
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default AssignmentSubmissionsPage;