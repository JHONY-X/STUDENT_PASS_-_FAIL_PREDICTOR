import React, { useState } from 'react';
import { FileText, Download, Trash2, Calendar, FileSpreadsheet, FilePieChart, Brain } from 'lucide-react';
import jsPDF from 'jspdf';
import './Reports.css';

function Reports() {
  const [activeTab, setActiveTab] = useState('All');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const tabs = ['All Reports', 'Performance Reports', 'Prediction Reports', 'Custom Reports'];

  const templates = [
    {
      id: 'overall',
      title: 'Overall Performance Report',
      desc: 'Comprehensive overview of your academic performance.',
      date: 'May 20, 2025',
      category: 'Performance Reports',
      icon: <FileText size={28} className="template-icon-purple" />
    },
    {
      id: 'prediction',
      title: 'Pass/Fail Prediction Report',
      desc: 'Detailed AI prediction analysis and probability.',
      date: 'May 20, 2025',
      category: 'Prediction Reports',
      icon: <FilePieChart size={28} className="template-icon-blue" />
    },
    {
      id: 'semester',
      title: 'Semester Analysis Report',
      desc: 'In-depth semester-wise performance review.',
      date: 'May 20, 2025',
      category: 'Performance Reports',
      icon: <FileSpreadsheet size={28} className="template-icon-indigo" />
    },
    {
      id: 'ai',
      title: 'AI Recommendation Report',
      desc: 'Personalised AI suggestions for improvement.',
      date: 'May 20, 2025',
      category: 'Custom Reports',
      icon: <Brain size={28} className="template-icon-magenta" />
    }
  ];

  const handleDownload = (id, title) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(11, 13, 24);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Header
      doc.setTextColor(168, 85, 247);
      doc.setFontSize(22);
      doc.text("NEUROGRADE AI", 20, 30);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(title.toUpperCase(), 20, 42);
      
      // Line
      doc.setDrawColor(139, 92, 246);
      doc.setLineWidth(0.5);
      doc.line(20, 48, 190, 48);
      
      // Details
      doc.setFontSize(11);
      doc.setTextColor(156, 163, 175);
      doc.text(`Student Name: ${user.username || 'John Doe'}`, 20, 60);
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 20, 68);
      doc.text(`Status: Official Report`, 20, 76);
      
      // Content
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text("Executive Summary:", 20, 95);
      
      doc.setTextColor(209, 213, 219);
      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(
        "This automated academic review compiles the student's metrics from attendance, daily study patterns, assignment score indexes, and test margins. Based on our random forest ensemble classifier, the subject is predicted to maintain a consistent trajectory. Overall probability is in line with baseline averages.",
        170
      );
      doc.text(splitText, 20, 105);
      
      // Metrics box
      doc.setFillColor(16, 15, 28);
      doc.rect(20, 130, 170, 60, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text("Key Metric Summary:", 25, 140);
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text("Attendance Index: 92% (Excellent)", 25, 150);
      doc.text("Avg Study Hours: 5.2 hrs (Good)", 25, 158);
      doc.text("Assignment Rate: 85% (Passing)", 25, 166);
      doc.text("Overall Grade Index: 84% (Very Good)", 25, 174);
      
      // Signature footer
      doc.setTextColor(139, 92, 246);
      doc.setFontSize(10);
      doc.text("SYSTEM VERIFIED - NEUROGRADE AI ACADEMIC SYSTEM", 20, 240);
      
      doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF");
    }
  };

  const filteredTemplates = activeTab === 'All' 
    ? templates 
    : templates.filter(t => t.category.toLowerCase().includes(activeTab.toLowerCase().split(' ')[0]));

  return (
    <div className="reports-container animate-in fade-in duration-500">
      <div className="reports-header">
        <h2 className="reports-title">Reports Center</h2>
        <p className="reports-subtitle">Generate and download your academic performance reports.</p>
      </div>

      {/* Tabs */}
      <div className="reports-tabs-container">
        {tabs.map((tab) => {
          const tabShortName = tab === 'All Reports' ? 'All' : tab;
          const isActive = activeTab === tabShortName;
          return (
            <button
              key={tab}
              className={`reports-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tabShortName)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="reports-grid">
        {filteredTemplates.map((tmpl) => (
          <div key={tmpl.id} className="template-card">
            <div className="template-icon-wrapper">
              {tmpl.icon}
            </div>
            <h3 className="template-card-title">{tmpl.title}</h3>
            <p className="template-card-desc">{tmpl.desc}</p>
            <div className="template-card-footer">
              <span className="template-date">
                <Calendar size={13} /> {tmpl.date}
              </span>
              <button 
                className="template-download-btn"
                onClick={() => handleDownload(tmpl.id, tmpl.title)}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report History */}
      <div className="report-history-panel">
        <h3 className="history-panel-title">Report History</h3>
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated On</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Overall Performance Report</td>
                <td>
                  <span className="history-type-badge">Performance</span>
                </td>
                <td>May 20, 2025</td>
                <td className="history-actions-cell">
                  <button 
                    className="history-action-btn"
                    title="Download Report"
                    onClick={() => handleDownload('overall', 'Overall Performance Report')}
                  >
                    <Download size={14} />
                  </button>
                  <button 
                    className="history-action-btn delete"
                    title="Delete"
                    onClick={() => alert("Report deletion is locked in history mode.")}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
