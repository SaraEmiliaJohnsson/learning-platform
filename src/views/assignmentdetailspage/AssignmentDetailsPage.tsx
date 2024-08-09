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
    const [file, setFile] = useState<File | null>(null);
    const [githubLink, setGithubLink] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [grade, setGrade] = useState<string>('');
    const [graded, setGraded] = useState<boolean>(false);
    const [submissionStatus, setSubmissionStatus] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            if (!courseId || !assignmentId) {
                console.error('Course ID or Assignment ID is undefined');
                return;
            }
            try {
                // Fetch course title
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (courseDoc.exists()) {
                    const courseData = courseDoc.data();
                    setCourseTitle(courseData?.title || '');
                }
                // Fetch assignment details
                const assignmentDoc = await getDoc(doc(db, `courses/${courseId}/assignments`, assignmentId));
                if (assignmentDoc.exists()) {
                    const data = assignmentDoc.data();
                    setAssignmentTitle(data?.title || '');
                    setAssignmentDescription(data?.description || '');
                }

                // Fetch student's previous submission, if exists
                const responseDoc = await getDoc(doc(db, `courses/${courseId}/assignments/${assignmentId}/responses`, currentUser?.uid || ''));
                if (responseDoc.exists()) {
                    const responseData = responseDoc.data();
                    setGithubLink(responseData.response || '');
                    setGraded(responseData.graded || false);
                    setFeedback(responseData.feedback || '');
                    setGrade(responseData.grade || '');
                }
            } catch (error) {
                console.error('Error fetching assignment details', error);
            }
        };
        fetchDetails();
    }, [courseId, assignmentId, currentUser?.uid]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId || !assignmentId) return;

        try {
            const responseRef = doc(collection(db, `courses/${courseId}/assignments/${assignmentId}/responses`));
            await setDoc(responseRef, {
                studentId: currentUser?.uid,
                githubLink: githubLink,
                submissionTimestamp: new Date(),
                graded: false,
                feedback: '',
                grade: '',
            });
            setSubmissionStatus('Your response has been submitted successfully.');
            setTimeout(() => navigate(-1));

        } catch (error) {
            console.error('Error submitting response', error);
            setSubmissionStatus('There was en error submitting your response.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
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
                {!graded ? (
                    <form className="form-container" onSubmit={handleSubmit}>
                        <label>
                            GitHub Länk:
                            <input type="url" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder="Skriv in din GitHub länk" />
                        </label>
                        <label>
                            Ladda upp en fil:
                            <input type="file" onChange={handleFileChange} />
                        </label>
                        <button className="submit-button" type="submit">Skicka Svar</button>
                    </form>
                ) : (
                    <div>
                        <h3>Dina svar har blivit rättade.</h3>
                        <p><strong>Feedback:</strong> {feedback}</p>
                        <p><strong>Grade:</strong> {grade}</p>
                    </div>
                )}

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