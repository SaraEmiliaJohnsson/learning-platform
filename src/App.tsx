import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import './App.css';
import LoginComponent from './views/login/LoginComponent';
import RegisterComponent from './views/register/RegisterComponent';
import StudentLandingPage from './views/landingpage/StudentLandingPage';
import TeacherLandingPage from './views/landingpage/TeacherLandingPage';
import AddCoursePage from './views/addcoursepage/AddCoursePage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<LoginComponent />} />
          <Route path='/register' element={<RegisterComponent />} />
          <Route path='/student' element={<StudentLandingPage />} />
          <Route path='/teacher' element={<TeacherLandingPage />} />
          <Route path='/add-course' element={<AddCoursePage />} />
        </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;
