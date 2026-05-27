import React from 'react';
import { Search, Bell } from 'lucide-react';
import './Topbar.css';

function Topbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const profileIcon = user.profileIcon || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=6d28d9&color=fff`;

  return (
    <div className="topbar-container">
      <div className="topbar-left">
        {/* Placeholder if we want to display search or left section */}
      </div>
      <div className="topbar-right">
        <button className="topbar-btn" aria-label="Search">
          <Search size={18} />
        </button>
        <button className="topbar-btn notification-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-badge"></span>
        </button>
        <div className="topbar-profile">
          <img src={profileIcon} alt="Profile" className="topbar-avatar" />
        </div>
      </div>
    </div>
  );
}

export default Topbar;
