import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../components/firebase/FirebaseConfig";
import './TeacherLandingPage.css';



const TeacherLandingPage = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
            console.log('Utloggad');

        } catch (error) {
            console.error('Failed to sign out', error);
        }
    }


    return (
        <section className="teacher-landingpage-wrapper">
            <header className="landingpage-header">
                <h2>Lärarens sida</h2>
                <button className="header-button-teacher" onClick={() => navigate('/add-course')}>Lägg till Kurs</button>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="landingpage-main">

            </main>

        </section>
    )
}

export default TeacherLandingPage;