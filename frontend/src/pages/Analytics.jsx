import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, BarChart, Bar, Legend, Cell
} from 'recharts';
import './Analytics.css';

function Analytics() {
  // GPA Trend data
  const gpaData = [
    { name: 'Semester 1', GPA: 3.1 },
    { name: 'Semester 2', GPA: 3.4 },
    { name: 'Semester 3', GPA: 3.2 },
    { name: 'Semester 4', GPA: 3.6 }
  ];

  // Subject Analysis radar data
  const subjectData = [
    { subject: 'Math', A: 85, B: 100, fullMark: 100 },
    { subject: 'Science', A: 90, B: 100, fullMark: 100 },
    { subject: 'English', A: 75, B: 100, fullMark: 100 },
    { subject: 'History', A: 80, B: 100, fullMark: 100 },
    { subject: 'Art', A: 95, B: 100, fullMark: 100 }
  ];

  // Score Distribution area data
  const scoreData = [
    { name: 'Quizzes', Score: 79 },
    { name: 'Assignments', Score: 85 },
    { name: 'Exams', Score: 81 },
    { name: 'Projects', Score: 88 }
  ];

  // Attendance History data
  const attendanceData = [
    { name: 'Week 1', Attendance: 90 },
    { name: 'Week 2', Attendance: 92 },
    { name: 'Week 3', Attendance: 95 },
    { name: 'Week 4', Attendance: 92 }
  ];

  return (
    <div className="analytics-container animate-in fade-in duration-500">
      <div className="analytics-header">
        <h2 className="analytics-title">Performance Analytics</h2>
        <p className="analytics-subtitle">Deep dive into your academic trends and projections.</p>
      </div>

      {/* Top Row: GPA Trend & Subject Analysis Radar */}
      <div className="analytics-grid-2">
        <div className="analytics-card">
          <h3 className="analytics-card-title">GPA Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 4.0]} tickCount={5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0d18', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#c084fc' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="GPA" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#07070a' }}
                  activeDot={{ r: 6, fill: '#c084fc' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card flex-center-col">
          <h3 className="analytics-card-title">Subject Analysis</h3>
          <div className="chart-wrapper flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" r="70%" data={subjectData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={8} tick={false} axisLine={false} />
                <Radar name="Student A" dataKey="A" stroke="#a855f7" fill="#8b5cf6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Score Distribution & Attendance History */}
      <div className="analytics-grid-2">
        <div className="analytics-card">
          <h3 className="analytics-card-title">Score Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0d18', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#c084fc' }}
                />
                <Area type="monotone" dataKey="Score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card">
          <h3 className="analytics-card-title">Attendance History</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0d18', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
                <Bar dataKey="Attendance" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={30}>
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#a78bfa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
