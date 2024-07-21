import React, { useState } from "react"
import { useAuth } from "../../components/auth/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import './RegisterComponent.css';
import { useNavigate } from "react-router-dom";



const RegisterComponent: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("User ID:", user.uid);

            await login(email, password);

            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: user.email,
                role: role,
            });

            const roleCollection = role === 'student' ? 'students' : 'teachers';
            await setDoc(doc(db, roleCollection, user.uid), {
                name: name,
                email: user.email,
                role: role,
            });




            if (role === 'student') {
                navigate('/student');
            } else if (role === 'teacher') {
                navigate('/teacher');
            }
        } catch (error) {
            console.error('Failed to create account', error);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    }

    return (
        <section className="register-container">
            <h2 className="register-heading">Registrera dig här för att skapa ett konto <br /> på StudyWay</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="name" className="login-label">Namn:</label>
                <input type="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Namn.." required />
                <label htmlFor="email" className="login-label">E-postadress:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-postadress.." required />
                <label htmlFor="password" className="login-label">Lösenord:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lösenord.." required />
                <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="teacher">Lärare</option>
                </select>
                <button className="register-button" type="submit">Registrera</button>
                <button className="back-button" onClick={handleBackClick}>Tillbaka</button>
            </form>
        </section>
    );
};

export default RegisterComponent;