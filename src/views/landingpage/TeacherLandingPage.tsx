import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../components/firebase/FirebaseConfig";
import './TeacherLandingPage.css';



const TeacherLandingPage = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/login');
            console.log('Utloggad');

        } catch (error) {
            console.error('Failed to sign out', error);
        }
    }


    return (
        <section className="teacher-landingpage-wrapper">
            <header className="landingpage-header">
                <h2>Lärarens sida</h2>
            </header>
            <main className="landingpage-main">
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </main>

        </section>
    )
}

export default TeacherLandingPage;