import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Assignments, LinkResource, ReadingTip, Student } from "../../types";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { useAuth } from "../../components/auth/AuthContext";
import { signOut } from "firebase/auth";
import './CourseDetailsPage.css';
import { IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';



const CourseDetailsPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { currentUser } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [assignments, setAssignments] = useState<Assignments[]>([]);
    const [readingTips, setReadingTips] = useState<ReadingTip[]>([]);
    const [links, setLinks] = useState<LinkResource[]>([]);
    const [courseTitle, setCourseTitle] = useState<String>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
                        const assignmentsSnapshot = await getDocs(collection(db, `courses/${courseId}/assignments`));
                        assignmentsSnapshot.forEach((doc) => {
                            assignmentsData.push({ id: doc.id, ...doc.data() } as Assignments);
                        });

                        const readingTipsData: ReadingTip[] = [];
                        const readingTipsSnapshot = await getDocs(collection(db, `courses/${courseId}/readingTips`));
                        readingTipsSnapshot.forEach((doc) => {
                            readingTipsData.push({ id: doc.id, ...doc.data() } as ReadingTip);
                        });

                        const linksData: LinkResource[] = [];
                        const linksSnapshot = await getDocs(collection(db, `courses/${courseId}/links`));
                        linksSnapshot.forEach((doc) => {
                            linksData.push({ id: doc.id, ...doc.data() } as LinkResource);
                        });

                        setStudents(studentData);
                        setAssignments(assignmentsData);
                        setReadingTips(readingTipsData);
                        setLinks(linksData);
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

    const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddAssignmentsClick = () => {
        navigate(`/course/${courseId}/add-assignment`)
    };

    const handleAddLessonClick = () => {
        navigate(`/course/${courseId}/add-lesson`);
        handleMenuClose();
    };

    const handleAddReadingTipClick = () => {
        navigate(`/course/${courseId}/add-reading-tip`);
        handleMenuClose();
    };

    const handleAddLinkClick = () => {
        navigate(`/course/${courseId}/add-link`);
        handleMenuClose();
    };

    const markCourseAsCompleted = async (courseId: string) => {
        if (!courseId) {
            console.error('Course ID is undefined');
            return;
        }

        const courseRef = doc(db, 'courses', courseId);
        try {
            await updateDoc(courseRef, { completed: true });
            console.log('Course marked as completed');

        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    return (
        <div className="course-details-wrapper">
            <header className="course-details-header">
                <h2>{courseTitle}</h2>
                <IconButton onClick={handleMenuClick}>
                    <MenuIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={handleAddAssignmentsClick}>Lägg till Uppgift</MenuItem>
                    <MenuItem onClick={handleAddLessonClick}>Lägg till Lektion</MenuItem>
                    <MenuItem onClick={handleAddReadingTipClick}>Lägg till Boktips</MenuItem>
                    <MenuItem onClick={handleAddLinkClick}>Lägg till Länktips</MenuItem>
                </Menu>

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
                <h3>Boktips</h3>
                <ul className="reading-tips-list">
                    {readingTips.map((tip) => (
                        <li key={tip.id}>{tip.title}</li>
                    ))}
                </ul>
                <h3>Länktips</h3>
                <ul className="links-list">
                    {links.map((link) => (
                        <li key={link.id}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a></li>
                    ))}
                </ul>
                <button onClick={() => markCourseAsCompleted(courseId!)}>Lägg kursen som avslutad</button>
            </main>
            <footer className="footer">
                <p>&copy; 2023 Your Learning Platform. All rights reserved.</p>
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/terms-of-service">Terms of Service</a>
            </footer>
        </div>
    );
}

export default CourseDetailsPage;