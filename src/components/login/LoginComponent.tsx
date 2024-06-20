import { useState } from "react"
import { useAuth } from "../auth/AuthContext";



const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            console.error('Failed to log in', error);
        }
    };


    return (
        <div className="login-container">
            <h2 className="login-heading">Logga in för att komma in på StudyWay</h2>
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor="email">E-postadress:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-postadress" id="email" /><br />
                <label htmlFor="password">Lösenord:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lösenord" id="password" /><br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginComponent;