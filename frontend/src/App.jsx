import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PredictionForm from './pages/PredictionForm';
import About from './pages/About';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import CalendarView from './pages/CalendarView';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

function AppContent() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  const noSidebarPaths = ['/', '/login', '/register'];
  const showSidebar = isAuthenticated && !noSidebarPaths.includes(location.pathname);

  return (
    <div className="app-layout">
      {showSidebar && <Sidebar />}
      <div className="app-main">
        {showSidebar && <Topbar />}
        <div className={showSidebar ? "container mt-4" : "w-full"} style={showSidebar ? { padding: '0 40px', maxWidth: '1400px', width: '100%' } : {}}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/home" 
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
            />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/predict" 
              element={isAuthenticated ? <PredictionForm /> : <Navigate to="/register" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/analytics" 
              element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports" 
              element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/calendar" 
              element={isAuthenticated ? <CalendarView /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/calender" 
              element={isAuthenticated ? <CalendarView /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/messages" 
              element={isAuthenticated ? <Messages /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/messsage" 
              element={isAuthenticated ? <Messages /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
