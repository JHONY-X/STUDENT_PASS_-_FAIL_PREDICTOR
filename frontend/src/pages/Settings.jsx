import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Settings as SettingsIcon, Camera, Moon, Sun, Save, AlertCircle } from 'lucide-react';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const initialUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    username: initialUser.username || '',
    email: initialUser.email || '',
    major: initialUser.major || ''
  });
  const [profileImage, setProfileImage] = useState(initialUser.profileIcon || '');
  const [preferences, setPreferences] = useState({
    darkMode: true,
    weeklyEmails: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Update Profile Image if changed
      if (profileImage && profileImage !== initialUser.profileIcon) {
        await axios.put('http://localhost:5000/api/auth/profile-image', {
          profile_image: profileImage
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // 2. Update Personal Details
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage
      const updatedUser = {
        ...res.data.user,
        profileIcon: profileImage // Ensure local copy has the base64 string
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess("Settings updated successfully!");
      
      setTimeout(() => {
        navigate('/profile');
        window.location.reload();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.username || 'User')}&background=6d28d9&color=fff`;

  return (
    <div className="settings-page-container animate-in fade-in duration-500">
      <div className="settings-page-header">
        <h2 className="settings-page-title">Account Settings</h2>
        <p className="settings-page-subtitle">Manage your profile details, avatar, and academic configurations.</p>
      </div>

      <div className="settings-panel-form-card">
        {error && <div className="settings-alert settings-alert-error"><AlertCircle size={16} /> {error}</div>}
        {success && <div className="settings-alert settings-alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="settings-main-form">
          
          {/* Avatar Section */}
          <div className="settings-avatar-section">
            <div className="avatar-preview-wrapper">
              <img 
                src={profileImage || defaultAvatar} 
                alt="Profile Preview" 
                className="avatar-image-circle"
              />
              <label htmlFor="avatar-file-input" className="avatar-edit-badge">
                <Camera size={14} />
              </label>
              <input 
                id="avatar-file-input" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden-file-input"
              />
            </div>
            <div className="avatar-info-details">
              <h4 className="avatar-label-title">Change Avatar</h4>
              <p className="avatar-label-sub">JPG or PNG. Max size 800K.</p>
            </div>
          </div>

          {/* Personal details grid */}
          <div className="settings-inputs-grid">
            <div className="settings-input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                required 
                className="settings-form-control"
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="settings-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="settings-form-control"
                placeholder="e.g. student@example.com"
              />
            </div>

            <div className="settings-input-group">
              <label>Field of Study (Major)</label>
              <input 
                type="text" 
                name="major" 
                value={formData.major} 
                onChange={handleChange} 
                className="settings-form-control"
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>

          {/* Preferences toggles */}
          <div className="settings-preferences-section">
            <h3 className="preferences-section-title">Preferences</h3>
            
            <div className="preferences-toggle-row">
              <div className="toggle-label-column">
                <span className="toggle-option-label">Dark Mode</span>
                <span className="toggle-option-sub">Use high-contrast dark theme.</span>
              </div>
              <button 
                type="button" 
                className={`preferences-switch ${preferences.darkMode ? 'on' : ''}`}
                onClick={() => handleToggle('darkMode')}
              >
                <span className="switch-thumb"></span>
              </button>
            </div>

            <div className="preferences-toggle-row">
              <div className="toggle-label-column">
                <span className="toggle-option-label">Weekly Summary Emails</span>
                <span className="toggle-option-sub">Receive progress reports directly in your inbox.</span>
              </div>
              <button 
                type="button" 
                className={`preferences-switch ${preferences.weeklyEmails ? 'on' : ''}`}
                onClick={() => handleToggle('weeklyEmails')}
              >
                <span className="switch-thumb"></span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="settings-action-row">
            <button 
              type="submit" 
              className="settings-save-changes-btn" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="spinner-loader"></span> Saving...
                </span>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Settings;
