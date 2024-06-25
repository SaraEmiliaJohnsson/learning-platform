import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../components/firebase/FirebaseConfig";



const StudentLandingPage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {


        try {
            await signOut(auth);
            navigate('/login');
            console.log('Utloggad');
        } catch (error) {
            console.error('Failed to log out', error);
        }

    }

    return (
        <section>
            <h2>Elev sida</h2>

            <button className="logout-button" onClick={handleLogout}>Logga ut</button>
        </section>
    )
}

export default StudentLandingPage;