import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, User, Dna, FileText, TrendingUp, Calendar, Bell, Settings, LogOut,
  Brain, Bot
} from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profileIcon = user.profileIcon || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=6d28d9&color=fff`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const navItems = [
    { name: 'Overview',        path: '/home',        icon: <LayoutDashboard size={18} /> },
    { name: 'Profile',         path: '/profile',     icon: <User size={18} /> },
    { name: 'Dashboard',       path: '/dashboard',   icon: <Dna size={18} /> },
    { name: 'Reports',         path: '/reports',     icon: <FileText size={18} /> },
    { name: 'Performance',     path: '/analytics',   icon: <TrendingUp size={18} /> },
    { name: 'Calendar',        path: '/calendar',    icon: <Calendar size={18} /> },
    { name: 'Event Reminders', path: '/messages',    icon: <Bell size={18} /> },
    { name: 'Settings',        path: '/settings',    icon: <Settings size={18} /> },
  ];

  return (
    <aside className="sidebar-container">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Brain size={24} className="sidebar-logo-icon" />
          <span className="sidebar-title">NeuroGrade AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/calendar' && location.pathname === '/calender') ||
            (item.path === '/messages' && location.pathname === '/messsage');
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <div className="sidebar-link-content">
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* AI Mentor Box */}
        <div className="ai-mentor-box">
          <div className="mentor-header">
            <Bot size={18} className="mentor-icon" />
            <span className="mentor-title">AI Mentor</span>
          </div>
          <p className="mentor-text">Hey! I'm here to help you improve.</p>
        </div>

        {/* Profile mini card */}
        {isAuthenticated && (
          <div className="profile-mini-card" onClick={() => navigate('/profile')}>
            <div className="profile-mini-info">
              <img src={profileIcon} alt="Avatar" className="profile-mini-img" />
              <div className="profile-text-details">
                <p className="profile-mini-name">{user.username || 'Student'}</p>
                <p className="profile-mini-role">View Profile</p>
              </div>
            </div>
            <button className="profile-mini-dots" onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
