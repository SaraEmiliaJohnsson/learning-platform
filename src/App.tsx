import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import './App.css';
import LoginComponent from './views/login/LoginComponent';
import RegisterComponent from './views/register/RegisterComponent';
import StudentLandingPage from './views/landingpage/StudentLandingPage';
import TeacherLandingPage from './views/landingpage/TeacherLandingPage';
import AddCoursePage from './views/addcoursepage/AddCoursePage';
import ViewStudentsRegistered from './views/viewstudents/ViewStudentsRegistered';
import CourseDetailsPage from './views/coursedetailspage/CourseDetailsPage';
import AddAssignmentsPage from './views/addassignmentspage/AddAssigmnentsPage';
import StudentCourseDetailsPage from './views/coursedetailspage/StudentsCourseDetailsPage';
import AddLessonPage from './views/addlessonpage/AddLessonPage';
import TeacherMessagePage from './views/teachermessagepage/TeacherMessagePage';
import StudentMessagesPage from './views/studentmessagepage/StudentMessagesPage';
import AddReadingTipPage from './views/addreadingtip/AddReadingTipPage';
import AddLinkPage from './views/addlinkpage/AddLinkPage';
import CompleatedCoursesPage from './views/completedcoursespage/CompletedCoursesPage';
import AssignmentDetailsPage from './views/assignmentdetailspage/AssignmentDetailsPage';
import AssignmentSubmissionsPage from './views/assignmentsubmissionspage/AssignmentSubmissionsPage';

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
          <Route path='/see-students' element={<ViewStudentsRegistered />} />
          <Route path='/course/:courseId' element={<CourseDetailsPage />} />
          <Route path='/student/course/:courseId' element={<StudentCourseDetailsPage />} />
          <Route path="/course/:courseId/add-assignment" element={<AddAssignmentsPage />} />
          <Route path="/course/:courseId/add-lesson" element={<AddLessonPage />} />
          <Route path="/add-message" element={<TeacherMessagePage />} />
          <Route path="/student-message" element={<StudentMessagesPage />} />
          <Route path="/course/:courseId/add-reading-tip" element={<AddReadingTipPage />} />
          <Route path="/course/:courseId/add-link" element={<AddLinkPage />} />
          <Route path="/completed-courses" element={<CompleatedCoursesPage />} />
          <Route path="/course/:courseId/assignment/:assignmentId" element={<AssignmentDetailsPage />} />
          <Route path="/course/:courseId/assignment/:assignmentId/submissions" element={<AssignmentSubmissionsPage />} />

        </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;
