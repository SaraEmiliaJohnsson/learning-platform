import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import './App.css';
import LoginComponent from './components/login/LoginComponent';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginComponent />} />
        </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;
