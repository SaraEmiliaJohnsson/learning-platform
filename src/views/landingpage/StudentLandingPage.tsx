import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../components/firebase/FirebaseConfig";
import './StudentLandingPage.css';



const StudentLandingPage = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {


        try {
            await signOut(auth);
            navigate('/login');
            console.log('Utloggad');
        } catch (error) {
            console.error('Failed to log out', error);
        }

    }

    return (
        <section className="student-landingpage-wrapper">
            <header className="landingpage-header">
                <h2>Studerande sidan</h2>
                <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
            </header>
            <main className="landingpage-main">

            </main>

        </section>
    )
}

export default StudentLandingPage;