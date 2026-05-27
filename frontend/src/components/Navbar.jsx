import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, User, LogOut } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-white text-xl font-bold no-underline">
          <Activity className="text-purple-400" />
          <span>PassPredict</span>
        </Link>
        <div className="flex gap-6 items-center nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/predict">Predict</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'white' }}>
                <User size={16} /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
