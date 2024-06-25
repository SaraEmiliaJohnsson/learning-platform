import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../components/firebase/FirebaseConfig";



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
        <section>
            <h2>Lärarens sida</h2>
            <button className="logout-button" onClick={handleSignOut}>Logga ut</button>
        </section>
    )
}

export default TeacherLandingPage;