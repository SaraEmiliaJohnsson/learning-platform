import { useState } from "react"
import { useAuth } from "../../components/auth/AuthContext";
import './LoginComponent.css';
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../components/firebase/FirebaseConfig";


const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            console.log('Inloggad');

            const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
            const userRole = userDoc.data()?.role;

            if (userRole === 'student') {
                navigate('/student');
            } else if (userRole === 'teacher') {
                navigate('/teacher');
            }
        } catch (error) {
            console.error('Failed to log in', error);
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    }


    return (
        <div className="login-container">
            <h2 className="login-heading">Logga in för att komma in på StudyWay</h2>
            <form onSubmit={handleSubmit} className="form">
                <label className="login-label" htmlFor="email">E-postadress:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-postadress" id="email" /><br />
                <label className="login-label" htmlFor="password">Lösenord:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lösenord" id="password" /><br />
                <button className="login-button" type="submit">Logga in</button>
            </form>
            <button className="register-button" onClick={handleRegisterClick}>Registrera dig här</button>
        </div>
    );
};

export default LoginComponent;