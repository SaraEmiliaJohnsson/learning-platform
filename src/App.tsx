import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import './App.css';
import LoginComponent from './views/login/LoginComponent';
import RegisterComponent from './views/register/RegisterComponent';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginComponent />} />
          <Route path='/register' element={<RegisterComponent />} />
        </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;
