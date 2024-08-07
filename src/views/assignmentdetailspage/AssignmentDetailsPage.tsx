import { signOut } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import './AssignmentDetailsPage.css';
import { useAuth } from "../../components/auth/AuthContext";



const AssignmentDetailsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { courseId, assignmentId } = useParams<{ courseId: string, assignmentId: string }>();
    const [courseTitle, setCourseTitle] = useState<string>('');
    const [assignmentTitle, setAssignmentTitle] = useState<string>('');
    const [assignmentDescription, setAssignmentDescription] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
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

                const assignmentDoc = await getDoc(doc(db, `courses/${courseId}/assignments`, assignmentId));
                if (assignmentDoc.exists()) {
                    const data = assignmentDoc.data();
                    setAssignmentTitle(data?.title || '');
                    setAssignmentDescription(data?.description || '');
                }
            } catch (error) {
                console.error('Error fetching assignment details', error);
            }
        };
        fetchDetails();
    }, [courseId, assignmentId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId || !assignmentId) return;

        try {
            const responseRef = doc(collection(db, `courses/${courseId}/assignments/${assignmentId}/responses`));
            await setDoc(responseRef, {
                studentId: currentUser?.uid,
                response: response,
                submissionTimestamp: new Date(),
                graded: false,
            });
            alert('Respoinse submitted successfully');
        } catch (error) {
            console.error('Error submitting response', error);
        }
    };


    const handleBackClick = () => {
        navigate(-1);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Failed to sign out', error);
        };
    };

    return (
        <div className="assignment-details-wrapper">
            <header className="assignment-details-header">
                <h2>{courseTitle}</h2>
                <button className="back-button" onClick={handleBackClick}>Tillbaka</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="assignment-details-main">
                <h2>{assignmentTitle}</h2>
                <p>{assignmentDescription}</p>
                <form className="form-container" onSubmit={handleSubmit}>
                    <textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Enter your response" required></textarea>
                    <button className="submit-button" type="submit">Skicka Svar</button>
                </form>
            </main>
            <footer className="footer">
                <p>&copy; 2023 Your Learning Platform. All rights reserved.</p>
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-of-service">Terms of Service</a>
            </footer>
        </div>
    )
}

export default AssignmentDetailsPage;