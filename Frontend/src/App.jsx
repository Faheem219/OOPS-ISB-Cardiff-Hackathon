import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Auth from './components/Auth';
import StudentDashboard from './pages/StudentDashboard';
import ChatPage from './pages/ChatPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage.jsx';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/LandingPage" element={<LandingPage />} />
            <Route path="/" element={<Navigate to="/LandingPage" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;