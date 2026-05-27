import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Award, BookOpen, GraduationCap, Star, Layers, Cpu, Mail, Calendar } from 'lucide-react';
import './Profile.css';

function Profile() {
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [user, setUser] = useState(storedUser);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fresh user data
        const meRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(meRes.data);

        // Fetch stats
        const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);
      } catch (err) {
        console.error('Could not fetch profile data', err);
      }
    };
    if (token) fetchData();
  }, [token]);

  const profileIcon = user.profileIcon ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=6d28d9&color=fff&size=128`;

  // Real stats from API
  const history = stats?.history || [];
  const totalPredictions = stats?.total_predictions ?? 0;
  const passCount = stats?.pass_count ?? 0;
  const passRate = totalPredictions > 0 ? Math.round((passCount / totalPredictions) * 100) : 0;

  // Derive averages from history
  const avgConfidence = history.length > 0
    ? Math.round(history.reduce((sum, r) => sum + (r.confidence || 0), 0) / history.length)
    : 0;

  const avgStudyHours = history.length > 0
    ? (history.reduce((sum, r) => sum + (parseFloat(r.study_hours) || 0), 0) / history.length).toFixed(1)
    : '—';

  const avgAttendance = history.length > 0
    ? Math.round(history.reduce((sum, r) => sum + (parseFloat(r.attendance) || 0), 0) / history.length)
    : 0;

  // AI Synergy = engagement level based on number of predictions (more predictions = higher synergy)
  const synergyVal = Math.min(100, totalPredictions * 15 + 10);
  const gaugeData = [
    { name: 'Synergy', value: synergyVal },
    { name: 'Rest', value: 100 - synergyVal }
  ];
  const GAUGE_COLORS = ['#a855f7', 'rgba(255,255,255,0.04)'];

  // Dynamic achievements based on real data
  const achievements = [];
  if (avgAttendance >= 90) achievements.push({ label: 'Perfect Attendance', icon: '🎯' });
  if (passRate >= 80) achievements.push({ label: 'High Pass Rate', icon: '🏆' });
  if (totalPredictions >= 5) achievements.push({ label: 'Active Learner', icon: '📚' });
  if (avgConfidence >= 85) achievements.push({ label: 'High Confidence', icon: '⭐' });
  if (parseFloat(avgStudyHours) >= 5) achievements.push({ label: 'Dedicated Studier', icon: '💪' });
  if (achievements.length === 0) {
    achievements.push({ label: 'Getting Started', icon: '🚀' });
    achievements.push({ label: 'Make predictions to earn badges!', icon: '🎯' });
  }

  // Format joined date
  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="profile-container animate-in fade-in duration-500">

      {/* Top Banner Card */}
      <div className="profile-banner-card">
        <div className="profile-banner-bg-glow"></div>
        <div className="profile-banner-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-ring">
              <img src={profileIcon} alt="Profile" className="profile-avatar-img" />
            </div>
            <div className="profile-user-info">
              <h2 className="profile-user-name">{user.username || 'User'}</h2>
              <p className="profile-user-email">{user.email || '—'}</p>
              <div className="profile-role-badge">{user.role || 'Student'}</div>
            </div>
          </div>
          <div className="profile-quick-stats">
            <div className="profile-quick-stat-item">
              <span className="quick-stat-value">{passRate}%</span>
              <span className="quick-stat-label">Pass Rate</span>
            </div>
            <div className="profile-quick-stat-divider"></div>
            <div className="profile-quick-stat-item">
              <span className="quick-stat-value">{totalPredictions}</span>
              <span className="quick-stat-label">Predictions</span>
            </div>
            <div className="profile-quick-stat-divider"></div>
            <div className="profile-quick-stat-item">
              <span className="quick-stat-value">{avgConfidence}%</span>
              <span className="quick-stat-label">Avg. Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="profile-main-grid">

        {/* Left Column: About Me + Achievements */}
        <div className="profile-col-left">
          {/* About Me */}
          <div className="profile-panel">
            <h3 className="profile-panel-title">About Me</h3>
            <p className="profile-about-text">
              Hi! I'm {user.username || 'a student'}{user.major ? ` studying ${user.major.charAt(0).toUpperCase() + user.major.slice(1)}` : ''}.
              I use NeuroGrade AI to track and improve my academic performance.
              {totalPredictions > 0
                ? ` So far, I've made ${totalPredictions} prediction${totalPredictions !== 1 ? 's' : ''} with a ${passRate}% pass rate.`
                : ' I haven\'t made any predictions yet.'}
            </p>
            <div className="profile-detail-list">
              <div className="profile-detail-row">
                <BookOpen size={14} className="detail-icon" />
                <span className="detail-label">Major:</span>
                <span className="detail-value">{user.major ? user.major.charAt(0).toUpperCase() + user.major.slice(1) : 'Not set'}</span>
              </div>
              <div className="profile-detail-row">
                <GraduationCap size={14} className="detail-icon" />
                <span className="detail-label">Role:</span>
                <span className="detail-value">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}</span>
              </div>
              <div className="profile-detail-row">
                <Mail size={14} className="detail-icon" />
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email || '—'}</span>
              </div>
              <div className="profile-detail-row">
                <Calendar size={14} className="detail-icon" />
                <span className="detail-label">Joined:</span>
                <span className="detail-value">{joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="profile-panel">
            <h3 className="profile-panel-title">Achievements</h3>
            <div className="achievements-list">
              {achievements.map((ach, idx) => (
                <div key={idx} className="achievement-badge-card">
                  <span className="achievement-emoji">{ach.icon}</span>
                  <span className="achievement-text">{ach.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Academic Status + AI Personality */}
        <div className="profile-col-right">
          {/* Academic Status */}
          <div className="profile-panel">
            <h3 className="profile-panel-title">Academic Status</h3>
            <div className="academic-status-grid">
              <div className="academic-status-card">
                <div className="academic-status-icon-wrapper blue-glow">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <p className="academic-status-label">Avg. Study Hrs</p>
                  <p className="academic-status-value">{avgStudyHours}</p>
                </div>
              </div>

              <div className="academic-status-card">
                <div className="academic-status-icon-wrapper purple-glow">
                  <Layers size={20} />
                </div>
                <div>
                  <p className="academic-status-label">Attendance</p>
                  <p className="academic-status-value">{avgAttendance > 0 ? `${avgAttendance}%` : '—'}</p>
                </div>
              </div>

              <div className="academic-status-card">
                <div className="academic-status-icon-wrapper green-glow">
                  <Award size={20} />
                </div>
                <div>
                  <p className="academic-status-label">Pass Rate</p>
                  <p className="academic-status-value">{passRate}%</p>
                </div>
              </div>

              <div className="academic-status-card">
                <div className="academic-status-icon-wrapper pink-glow">
                  <Cpu size={20} />
                </div>
                <div>
                  <p className="academic-status-label">Predictions</p>
                  <p className="academic-status-value">{totalPredictions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Personality / Synergy Gauge */}
          <div className="profile-panel ai-synergy-panel">
            <h3 className="profile-panel-title">AI Synergy Level</h3>
            <div className="ai-synergy-gauge-wrapper">
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="synergy-gauge-center-label">
                <span className="synergy-value">{synergyVal}%</span>
                <span className="synergy-label">Synergy</span>
              </div>
            </div>
            <p className="ai-synergy-desc">
              {totalPredictions >= 5
                ? 'Your engagement with AI insights is excellent — keep using the platform regularly!'
                : totalPredictions > 0
                  ? `You've made ${totalPredictions} prediction${totalPredictions !== 1 ? 's' : ''}. Make more to boost your synergy level!`
                  : 'Start making predictions to build your AI synergy level!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
