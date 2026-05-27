import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Download, Bot, TrendingUp, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  // ──── Derive ALL values from real user data ────
  const history = stats?.history || [];
  const hasData = history.length > 0;
  const totalPredictions = stats?.total_predictions ?? 0;
  const passCount = stats?.pass_count ?? 0;
  const failCount = stats?.fail_count ?? 0;

  const latestRecord = hasData ? history[history.length - 1] : null;

  const passProb = latestRecord ? Math.round(latestRecord.confidence) : 0;
  const isPass = latestRecord ? latestRecord.prediction === 'PASS' : false;
  const riskLevel = latestRecord 
    ? (latestRecord.prediction === 'PASS' && latestRecord.confidence >= 80 ? 'Low' : latestRecord.prediction === 'FAIL' && latestRecord.confidence >= 80 ? 'High' : 'Medium') 
    : '—';

  // Averages from real records
  const avgAttendance = hasData
    ? Math.round(history.reduce((sum, r) => sum + (parseFloat(r.attendance) || 0), 0) / history.length)
    : 0;

  const avgStudyHours = hasData
    ? (history.reduce((sum, r) => sum + (parseFloat(r.study_hours) || 0), 0) / history.length).toFixed(1)
    : 0;

  const avgSleep = hasData
    ? (history.reduce((sum, r) => sum + (parseFloat(r.sleep_hours) || 0), 0) / history.length).toFixed(1)
    : 0;

  const avgStress = hasData
    ? (history.reduce((sum, r) => sum + (parseFloat(r.stress_level) || 0), 0) / history.length).toFixed(1)
    : 0;

  // Normalized scores for the performance bars
  const studyHoursScore = hasData ? Math.round((parseFloat(avgStudyHours) / 14) * 100) : 0;
  const sleepScore = hasData ? Math.round((parseFloat(avgSleep) / 10) * 100) : 0;
  const stressScore = hasData ? Math.round(((10 - parseFloat(avgStress)) / 10) * 100) : 0;  // inverted: lower stress = higher score
  const passRate = totalPredictions > 0 ? Math.round((passCount / totalPredictions) * 100) : 0;

  // Overall score derived from real metrics
  const overallScore = hasData
    ? Math.round((avgAttendance * 0.3 + studyHoursScore * 0.25 + sleepScore * 0.15 + stressScore * 0.15 + passRate * 0.15))
    : 0;

  const getOverallLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 55) return 'Good';
    if (score >= 40) return 'Average';
    if (score > 0) return 'Needs Improvement';
    return '—';
  };

  // Recommendation from the API (major-based)
  const recommendation = stats?.recommendation || '';

  const downloadPDF = async () => {
    const element = document.querySelector('.home-container');
    if (!element) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#07070a', useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${user.username || 'Student'}_Academic_Overview.pdf`);
    } catch (e) {
      console.error('PDF generation failed', e);
    } finally {
      setExporting(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk === 'Low') return 'text-green';
    if (risk === 'Medium') return 'text-warning';
    if (risk === 'High') return 'text-danger';
    return '';
  };

  return (
    <div className="home-container animate-in fade-in duration-500">
      {/* Header section */}
      <div className="overview-header-row">
        <div>
          <h2 className="overview-welcome">Welcome back, {user.username || 'Student'} 👋</h2>
          <p className="overview-sub">Here's your academic overview for today.</p>
        </div>
        <button className="download-report-btn" onClick={downloadPDF} disabled={exporting}>
          {exporting ? (
            <span className="flex items-center gap-2">
              <span className="spinner-loader"></span> Exporting...
            </span>
          ) : (
            <>
              <Download size={16} /> Download Report
            </>
          )}
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="overview-stats-grid">
        <div className="overview-stat-card">
          <span className="card-label">Pass Probability</span>
          <span className="card-value font-bold">{hasData ? `${passProb}%` : '—'}</span>
          <div className="card-footer green-badge">
            <span className={`dot-indicator ${isPass ? 'bg-green' : 'bg-red'}`}></span>
            <span>{hasData ? (isPass ? 'Likely to Pass' : 'At Risk of Failure') : 'No predictions yet'}</span>
          </div>
        </div>

        <div className="overview-stat-card">
          <span className="card-label">Current Risk Level</span>
          <span className={`card-value font-bold ${getRiskColor(riskLevel)}`}>{riskLevel}</span>
          <div className="card-footer text-muted">
            <span>{hasData ? (riskLevel === 'Low' ? 'Keep up the good work!' : riskLevel === 'High' ? 'Focus on weak areas' : 'Room for improvement') : 'Make a prediction first'}</span>
          </div>
        </div>

        <div className="overview-stat-card">
          <span className="card-label">Pass Rate</span>
          <span className="card-value font-bold">{hasData ? `${passRate}%` : '—'}</span>
          <div className="card-footer text-muted">
            <span>{hasData ? `${passCount} of ${totalPredictions} predictions` : 'No data yet'}</span>
          </div>
        </div>

        <div className="overview-stat-card">
          <span className="card-label">Overall Score</span>
          <span className="card-value font-bold">{hasData ? overallScore : '—'}<span className="score-total">{hasData ? '/100' : ''}</span></span>
          <div className="card-footer green-text">
            <span>{getOverallLabel(overallScore)} {hasData && overallScore >= 55 ? <ArrowUpRight size={12} className="inline" /> : null}</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="overview-main-grid">
        {/* Left Column: Performance Summary */}
        <div className="overview-panel performance-summary-card">
          <h3 className="panel-title">Performance Summary</h3>
          
          {hasData ? (
            <div className="metric-progress-list">
              <div className="metric-item">
                <div className="metric-info">
                  <span>Attendance</span>
                  <span className="metric-val">{avgAttendance}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${avgAttendance}%` }}></div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-info">
                  <span>Study Hours</span>
                  <span className="metric-val">{studyHoursScore}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${studyHoursScore}%` }}></div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-info">
                  <span>Sleep Quality</span>
                  <span className="metric-val">{sleepScore}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${sleepScore}%` }}></div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-info">
                  <span>Stress Management</span>
                  <span className="metric-val">{stressScore}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${stressScore}%` }}></div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-info">
                  <span>Pass Rate</span>
                  <span className="metric-val">{passRate}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${passRate}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <AlertCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>Make your first prediction to see your performance summary</p>
            </div>
          )}
        </div>

        {/* Right Column: AI Recommendation */}
        <div className="overview-panel ai-recommendation-card">
          <div className="recommendation-content">
            <h3 className="panel-title">AI Recommendation</h3>
            
            {hasData && recommendation ? (
              <>
                <p className="recommendation-desc">
                  {recommendation}
                </p>
                <ul className="recommendation-bullet-list">
                  {parseFloat(avgStudyHours) < 4 && (
                    <li>
                      <span className="bullet-dot"></span>
                      <span>Increase study hours (currently {avgStudyHours} hrs/day)</span>
                    </li>
                  )}
                  {avgAttendance < 85 && (
                    <li>
                      <span className="bullet-dot"></span>
                      <span>Improve attendance to above 85% (currently {avgAttendance}%)</span>
                    </li>
                  )}
                  {parseFloat(avgSleep) < 7 && (
                    <li>
                      <span className="bullet-dot"></span>
                      <span>Get more sleep (currently {avgSleep} hrs/night)</span>
                    </li>
                  )}
                  {parseFloat(avgStress) > 6 && (
                    <li>
                      <span className="bullet-dot"></span>
                      <span>Work on stress management (level {avgStress}/10)</span>
                    </li>
                  )}
                  {parseFloat(avgStudyHours) >= 4 && avgAttendance >= 85 && parseFloat(avgSleep) >= 7 && parseFloat(avgStress) <= 6 && (
                    <li>
                      <span className="bullet-dot"></span>
                      <span>Great metrics! Keep up the consistency</span>
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <p className="recommendation-desc" style={{ color: '#64748b' }}>
                Complete a prediction to receive personalized AI recommendations based on your academic profile.
              </p>
            )}
          </div>

          {/* Futuristic Glowing Brain SVG */}
          <div className="brain-graphic-container">
            <svg viewBox="0 0 100 100" className="brain-svg">
              <defs>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Core Nodes */}
              <circle cx="50" cy="50" r="15" fill="none" stroke="url(#purpleGrad)" strokeWidth="1" filter="url(#glow)" strokeDasharray="2,2"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="url(#purpleGrad)" strokeWidth="0.5" opacity="0.5"/>
              
              {/* Node connections mimicking brain hemispheres */}
              <path d="M 50 20 C 35 20, 25 35, 25 50 C 25 65, 35 80, 50 80 C 65 80, 75 65, 75 50 C 75 35, 65 20, 50 20 Z" fill="none" stroke="url(#purpleGrad)" strokeWidth="1" filter="url(#glow)"/>
              
              {/* Inner neural structures */}
              <path d="M 50 20 L 50 80 M 25 50 L 75 50 M 32 32 L 68 68 M 32 68 L 68 32" fill="none" stroke="url(#purpleGrad)" strokeWidth="0.5" opacity="0.3"/>
              
              {/* Glowing Synapses */}
              <circle cx="50" cy="20" r="3" fill="#c084fc" filter="url(#glow)"/>
              <circle cx="50" cy="80" r="3" fill="#6d28d9" filter="url(#glow)"/>
              <circle cx="25" cy="50" r="3" fill="#c084fc" filter="url(#glow)"/>
              <circle cx="75" cy="50" r="3" fill="#6d28d9" filter="url(#glow)"/>
              <circle cx="32" cy="32" r="2.5" fill="#a78bfa"/>
              <circle cx="68" cy="68" r="2.5" fill="#c084fc"/>
              <circle cx="32" cy="68" r="2.5" fill="#6d28d9"/>
              <circle cx="68" cy="32" r="2.5" fill="#a78bfa"/>
              
              {/* Concentric rings to make it feel rich and holographic */}
              <circle cx="50" cy="50" r="8" fill="none" stroke="#c084fc" strokeWidth="1" opacity="0.8" filter="url(#glow)"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
