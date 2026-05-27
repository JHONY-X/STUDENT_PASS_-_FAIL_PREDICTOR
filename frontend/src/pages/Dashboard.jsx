import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Clock, TrendingUp, Award, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

  // ──── Derive all values from real user data ────
  const history = stats?.history || [];
  const totalPredictions = stats?.total_predictions ?? 0;
  const passCount = stats?.pass_count ?? 0;
  const failCount = stats?.fail_count ?? 0;

  const hasData = history.length > 0;

  // Latest record from the user's own history
  const latestRecord = hasData ? history[history.length - 1] : null;

  // Averages from all user predictions
  const avgStudyHours = hasData
    ? (history.reduce((sum, r) => sum + (parseFloat(r.study_hours) || 0), 0) / history.length).toFixed(1)
    : '—';

  const avgAttendance = hasData
    ? Math.round(history.reduce((sum, r) => sum + (parseFloat(r.attendance) || 0), 0) / history.length)
    : '—';

  const avgSleep = hasData
    ? (history.reduce((sum, r) => sum + (parseFloat(r.sleep_hours) || 0), 0) / history.length).toFixed(1)
    : '—';

  const avgStress = hasData
    ? (history.reduce((sum, r) => sum + (parseFloat(r.stress_level) || 0), 0) / history.length).toFixed(1)
    : '—';

  // Latest confidence as the pass probability
  const passProb = latestRecord ? Math.round(latestRecord.confidence) : 0;
  const failProb = 100 - passProb;

  // Pie chart data
  const pieData = [
    { name: 'Pass Probability', value: passProb || 1 },
    { name: 'Fail Probability', value: failProb || 1 }
  ];
  const PIE_COLORS = ['#8b5cf6', 'rgba(255, 255, 255, 0.05)'];

  // Bar chart data from real averages
  const barData = hasData ? [
    { name: 'Study Hrs', score: Math.round((parseFloat(avgStudyHours) / 14) * 100) },
    { name: 'Attendance', score: avgAttendance },
    { name: 'Sleep', score: Math.round((parseFloat(avgSleep) / 10) * 100) },
    { name: 'Stress (inv)', score: Math.round(((10 - parseFloat(avgStress)) / 10) * 100) },
    { name: 'Pass Rate', score: totalPredictions > 0 ? Math.round((passCount / totalPredictions) * 100) : 0 }
  ] : [];

  // Line chart from prediction history (confidence over time)
  const lineData = history.map((r, i) => ({
    name: r.date || `#${i + 1}`,
    progress: Math.round(r.confidence)
  }));

  // Motivation meter: derived from latest stress level (lower stress = higher motivation feel)
  const motivationVal = latestRecord && latestRecord.stress_level
    ? Math.round(((10 - parseFloat(latestRecord.stress_level)) / 10) * 100)
    : 0;
  const gaugeData = [
    { name: 'Motivation', value: motivationVal || 1 },
    { name: 'Remaining', value: (100 - motivationVal) || 1 }
  ];
  const GAUGE_COLORS = ['#fbbf24', 'rgba(255, 255, 255, 0.05)'];

  // ──── No-data placeholder ────
  const EmptyState = ({ message }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '12px' }}>
      <AlertCircle size={32} style={{ color: '#64748b' }} />
      <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>{message}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#9ca3af' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-in fade-in duration-500">
      {/* Top Stats Cards Row */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <span className="stat-card-label">Study Hours / Day</span>
          <span className="stat-card-value">{avgStudyHours}{hasData ? ' hrs' : ''}</span>
          <span className="stat-card-footer" style={{ color: '#64748b' }}>
            {hasData ? `Based on ${totalPredictions} prediction${totalPredictions !== 1 ? 's' : ''}` : 'No data yet'}
          </span>
        </div>

        <div className="dashboard-stat-card">
          <span className="stat-card-label">Avg. Attendance</span>
          <span className="stat-card-value">{avgAttendance}{hasData ? '%' : ''}</span>
          <span className="stat-card-footer" style={{ color: '#64748b' }}>
            {hasData ? 'Across all records' : 'No data yet'}
          </span>
        </div>

        <div className="dashboard-stat-card">
          <span className="stat-card-label">Avg. Sleep</span>
          <span className="stat-card-value">{avgSleep}{hasData ? ' hrs' : ''}</span>
          <span className="stat-card-footer" style={{ color: '#64748b' }}>
            {hasData ? 'Nightly average' : 'No data yet'}
          </span>
        </div>

        <div className="dashboard-stat-card">
          <span className="stat-card-label">Avg. Stress Level</span>
          <span className="stat-card-value">{avgStress}{hasData ? '/10' : ''}</span>
          <span className="stat-card-footer" style={{ color: '#64748b' }}>
            {hasData ? 'Lower is better' : 'No data yet'}
          </span>
        </div>
      </div>

      {/* Middle Row Charts */}
      <div className="dashboard-charts-grid-2">
        {/* Pass vs Fail Probability */}
        <div className="dashboard-chart-card flex-center-col">
          <h3 className="chart-card-title">Pass vs Fail Probability</h3>
          {hasData ? (
            <>
              <div className="pie-chart-relative-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={65} 
                      outerRadius={80} 
                      paddingAngle={3} 
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0b0d18', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-chart-center-label">
                  <span className="center-percentage">{passProb}%</span>
                  <span className="center-text">Latest Pass Prob.</span>
                </div>
              </div>
              <div className="pie-chart-legend">
                <div className="legend-item">
                  <span className="legend-dot bg-purple"></span>
                  <span>Pass: {passCount} ({totalPredictions > 0 ? Math.round((passCount/totalPredictions)*100) : 0}%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot bg-faded"></span>
                  <span>Fail: {failCount} ({totalPredictions > 0 ? Math.round((failCount/totalPredictions)*100) : 0}%)</span>
                </div>
              </div>
            </>
          ) : (
            <EmptyState message="Make a prediction to see your pass/fail analysis" />
          )}
        </div>

        {/* Performance Overview Bar Chart */}
        <div className="dashboard-chart-card">
          <h3 className="chart-card-title">Performance Overview</h3>
          {hasData ? (
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b0d18', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}
                    itemStyle={{ color: '#c084fc' }}
                    formatter={(value) => [`${value}%`, 'Score']}
                  />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={30}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#a78bfa'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="Performance data will appear after your first prediction" />
          )}
        </div>
      </div>

      {/* Bottom Row Charts */}
      <div className="dashboard-charts-grid-2">
        {/* Progress over predictions */}
        <div className="dashboard-chart-card">
          <h3 className="chart-card-title">Confidence Trend</h3>
          {lineData.length > 1 ? (
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b0d18', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}
                    itemStyle={{ color: '#c084fc' }}
                    formatter={(value) => [`${value}%`, 'Confidence']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#a855f7" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#07070a' }}
                    activeDot={{ r: 6, fill: '#c084fc' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message={hasData ? "Make more predictions to see your confidence trend" : "Your confidence trend will appear here"} />
          )}
        </div>

        {/* Motivation Meter */}
        <div className="dashboard-chart-card flex-center-col relative">
          <h3 className="chart-card-title">Wellness Meter</h3>
          {hasData ? (
            <div className="motivation-meter-relative-container">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart margin={{ top: 10, bottom: 0 }}>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={65}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="motivation-meter-center-label">
                <span className="motivation-percentage font-bold">{motivationVal}%</span>
                <span className="motivation-text" style={{ color: motivationVal >= 70 ? '#10b981' : motivationVal >= 40 ? '#fbbf24' : '#f87171' }}>
                  {motivationVal >= 70 ? 'Great Balance!' : motivationVal >= 40 ? 'Room to Improve' : 'High Stress'}
                </span>
              </div>
            </div>
          ) : (
            <EmptyState message="Wellness insights will appear after predictions" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
