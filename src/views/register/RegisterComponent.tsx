import React, { useState } from "react"
import { useAuth } from "../../components/auth/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../components/firebase/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import './RegisterComponent.css';



const RegisterComponent: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("User ID:", user.uid);

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: role,
            });

            const roleCollection = role === 'student' ? 'students' : 'teachers';
            await setDoc(doc(db, roleCollection, user.uid), {
                email: user.email,
                role: role,
            });

            await login(email, password);
        } catch (error) {
            console.error('Failed to create account', error);
        }
    };

    return (
        <section className="register-container">
            <h2 className="register-heading">Registrera dig här för att skapa ett konto på StudyWay</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="email">E-postadress:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-postadress.." />
                <label htmlFor="password">Lösenord:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lösenord.." />
                <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="teacher">Lärare</option>
                </select>
                <button className="register-button" type="submit">Registrera</button>
            </form>
        </section>
    );
};

export default RegisterComponent;