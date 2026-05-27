import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import './Messages.css';

function Messages() {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    push: true,
    sync: true
  });

  const reminders = [
    {
      id: 1,
      title: 'Math Midterm',
      countdown: 'In 2 days',
      priority: 'High',
      date: 'June 1, 2026',
      desc: 'Topics: Calculus, Linear Algebra.'
    },
    {
      id: 2,
      title: 'Physics Assignment',
      countdown: 'In 6 days',
      priority: 'Medium',
      date: 'June 5, 2026',
      desc: 'Lab report submission.'
    },
    {
      id: 3,
      title: 'Final Exam',
      countdown: 'In 26 days',
      priority: 'High',
      date: 'June 25, 2026',
      desc: 'Comprehensive exam.'
    },
    {
      id: 4,
      title: 'AI Seminar',
      countdown: 'In 12 days',
      priority: 'Low',
      date: 'June 11, 2026',
      desc: 'Guest lecture on LLMs.'
    }
  ];

  const handleToggle = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Notification preferences saved successfully!");
  };

  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'badge-high';
    if (priority === 'Medium') return 'badge-medium';
    return 'badge-low';
  };

  return (
    <div className="messages-container animate-in fade-in duration-500">
      <div className="messages-header">
        <h2 className="messages-title">Event Reminders</h2>
        <p className="messages-subtitle">View your upcoming events and schedule.</p>
      </div>

      <div className="messages-main-grid">
        {/* Left Column: Reminders List */}
        <div className="reminders-list-column">
          {reminders.map((rem) => (
            <div key={rem.id} className="reminder-card-item">
              <div className="reminder-card-header">
                <div className="reminder-title-section">
                  <span className="reminder-bell-icon">
                    <Bell size={16} />
                  </span>
                  <h3 className="reminder-card-name">{rem.title}</h3>
                </div>
                <div className="reminder-badges">
                  <span className={`reminder-priority-badge ${getPriorityClass(rem.priority)}`}>
                    {rem.priority} Priority
                  </span>
                  <span className="reminder-countdown-badge">
                    <Clock size={12} /> {rem.countdown}
                  </span>
                </div>
              </div>
              <div className="reminder-card-body">
                <p className="reminder-date">Date: {rem.date}</p>
                <p className="reminder-desc">{rem.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Notification Preferences */}
        <div className="preferences-column">
          <div className="preferences-panel">
            <h3 className="preferences-panel-title">Notification Preferences</h3>
            <form onSubmit={handleSave} className="preferences-form">
              <div className="preference-option-row">
                <div className="preference-text-col">
                  <span className="preference-label">Email Alerts</span>
                  <span className="preference-sub">Receive daily summaries via email.</span>
                </div>
                <button
                  type="button"
                  className={`preference-toggle-switch ${preferences.email ? 'on' : ''}`}
                  onClick={() => handleToggle('email')}
                >
                  <span className="toggle-thumb-slider"></span>
                </button>
              </div>

              <div className="preference-option-row">
                <div className="preference-text-col">
                  <span className="preference-label">SMS Alerts</span>
                  <span className="preference-sub">Get critical priority updates on phone.</span>
                </div>
                <button
                  type="button"
                  className={`preference-toggle-switch ${preferences.sms ? 'on' : ''}`}
                  onClick={() => handleToggle('sms')}
                >
                  <span className="toggle-thumb-slider"></span>
                </button>
              </div>

              <div className="preference-option-row">
                <div className="preference-text-col">
                  <span className="preference-label">Push Notifications</span>
                  <span className="preference-sub">Alerts directly on your web browser.</span>
                </div>
                <button
                  type="button"
                  className={`preference-toggle-switch ${preferences.push ? 'on' : ''}`}
                  onClick={() => handleToggle('push')}
                >
                  <span className="toggle-thumb-slider"></span>
                </button>
              </div>

              <div className="preference-option-row">
                <div className="preference-text-col">
                  <span className="preference-label">Calendar Sync</span>
                  <span className="preference-sub">Automatically link to Google Calendar.</span>
                </div>
                <button
                  type="button"
                  className={`preference-toggle-switch ${preferences.sync ? 'on' : ''}`}
                  onClick={() => handleToggle('sync')}
                >
                  <span className="toggle-thumb-slider"></span>
                </button>
              </div>

              <button type="submit" className="save-preferences-btn">
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
