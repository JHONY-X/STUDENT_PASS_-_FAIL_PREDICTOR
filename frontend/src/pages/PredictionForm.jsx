import React, { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Sparkles, BookOpen, Heart, Monitor, Shield, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PredictionForm.css';

const STEPS = [
  { label: 'Academic', icon: <BookOpen size={14} /> },
  { label: 'Lifestyle', icon: <Heart size={14} /> },
  { label: 'Environment', icon: <Monitor size={14} /> },
  { label: 'Confidence', icon: <Shield size={14} /> },
  { label: 'Mindset', icon: <Sparkles size={14} /> },
];

function PredictionForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    major: '',
    study_hours: '',
    attendance: '',
    prev_exam: '',
    assignment_rate: '',
    subjects: '',
    quiz_perf: '',
    sleep_hours: '',
    social_media: '',
    screen_time: '',
    gaming_hours: '',
    stress_level: '',
    motivation: '',
    participation: '',
    revision: '',
    anxiety: '',
    internet: '1',
    family_support: '',
    quiet_study: '1',
    tutoring: '0',
    self_confidence: '',
    // Self-Confidence
    self_confidence_exam: '',
    self_confidence_material: '',
    self_confidence_assignments: '',
    self_confidence_problems: '',
    self_confidence_presentations: '',
    // Study Confidence
    study_confidence_routine: '',
    study_confidence_time: '',
    study_confidence_no_help: '',
    study_confidence_new_topics: '',
    study_confidence_focus: '',
    // Motivation & Discipline
    motivation_high_grades: '',
    motivation_avoid_distractions: '',
    discipline_revision: '',
    motivation_balance: '',
    motivation_consistency: '',
    // Mental & Emotional Readiness
    mental_handling_pressure: '',
    mental_recover_setbacks: '',
    mental_future_positive: '',
    mental_confidence_tests: '',
    mental_calm_before_exam: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let token = localStorage.getItem('token');
      if (token === 'null' || token === 'undefined') {
        token = null;
        localStorage.removeItem('token');
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post('http://localhost:5000/api/predict', formData, { headers });
      setResult(res.data);
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.error || err.response?.data?.msg || 'Failed to get prediction.');
      setLoading(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // ──── RESULT SCREEN ────
  if (result) {
    const isPass = result.prediction === 'PASS';
    return (
      <div className="predict-result-page">
        <div className={`predict-result-card ${isPass ? 'pass' : 'fail'}`}>
          <div className={`result-icon-ring ${isPass ? 'pass' : 'fail'}`}>
            {isPass ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
          </div>
          <h2 className="result-title">Prediction: {result.prediction}</h2>

          <div className="result-stats-row">
            <div className="result-stat">
              <span className="result-stat-value">{result.confidence}%</span>
              <span className="result-stat-label">Confidence</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-value">{result.risk_level}</span>
              <span className="result-stat-label">Risk Level</span>
            </div>
          </div>

          <div className="result-recs">
            <h4><Sparkles size={16} /> Recommendations</h4>
            <ul>
              {result.recommendations.map((rec, i) => (
                <li key={i}>
                  <ArrowRight className="rec-icon" size={16} />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={() => { setResult(null); setStep(0); }} className="btn-new-prediction">
            <BrainCircuit size={18} /> Make Another Prediction
          </button>
        </div>
      </div>
    );
  }

  // ──── STEP CONTENT ────
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="step-content" key="step-0">
            <div className="step-section-title"><BookOpen size={18} /> Academic Information</div>
            <p className="step-section-desc">Enter your academic metrics and study habits.</p>
            <div className="predict-grid">
              <div className="input-group">
                <label>Field of Study (Major)</label>
                <input type="text" name="major" required className="form-control" value={formData.major} onChange={handleChange} placeholder="e.g. Computer Science" />
              </div>
              <div className="input-group">
                <label>Study Hours/Day (0-14)</label>
                <input type="number" name="study_hours" required className="form-control" value={formData.study_hours} onChange={handleChange} min="0" max="14" placeholder="e.g. 5" />
              </div>
              <div className="input-group">
                <label>Attendance % (0-100)</label>
                <input type="number" name="attendance" required className="form-control" value={formData.attendance} onChange={handleChange} min="0" max="100" placeholder="e.g. 85" />
              </div>
              <div className="input-group">
                <label>Previous Exam Score (0-100)</label>
                <input type="number" name="prev_exam" required className="form-control" value={formData.prev_exam} onChange={handleChange} min="0" max="100" placeholder="e.g. 72" />
              </div>
              <div className="input-group">
                <label>Assignment Rate %</label>
                <input type="number" name="assignment_rate" required className="form-control" value={formData.assignment_rate} onChange={handleChange} min="0" max="100" placeholder="e.g. 90" />
              </div>
              <div className="input-group">
                <label>Quiz Performance %</label>
                <input type="number" name="quiz_perf" required className="form-control" value={formData.quiz_perf} onChange={handleChange} min="0" max="100" placeholder="e.g. 78" />
              </div>
              <div className="input-group">
                <label>Number of Subjects</label>
                <input type="number" name="subjects" required className="form-control" value={formData.subjects} onChange={handleChange} min="1" max="15" placeholder="e.g. 5" />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="step-content" key="step-1">
            <div className="step-section-title"><Heart size={18} /> Lifestyle & Behavior</div>
            <p className="step-section-desc">Tell us about your daily habits and well-being.</p>
            <div className="predict-grid">
              <div className="input-group">
                <label>Sleep Hours (0-24)</label>
                <input type="number" name="sleep_hours" required className="form-control" value={formData.sleep_hours} onChange={handleChange} min="0" max="24" placeholder="e.g. 7" />
              </div>
              <div className="input-group">
                <label>Screen Time (0-24 hrs)</label>
                <input type="number" name="screen_time" required className="form-control" value={formData.screen_time} onChange={handleChange} min="0" max="24" placeholder="e.g. 4" />
              </div>
              <div className="input-group">
                <label>Social Media (0-24 hrs)</label>
                <input type="number" name="social_media" required className="form-control" value={formData.social_media} onChange={handleChange} min="0" max="24" placeholder="e.g. 2" />
              </div>
              <div className="input-group">
                <label>Gaming Hours (0-24)</label>
                <input type="number" name="gaming_hours" required className="form-control" value={formData.gaming_hours} onChange={handleChange} min="0" max="24" placeholder="e.g. 1" />
              </div>
              <div className="input-group">
                <label>Stress Level (1-10)</label>
                <input type="number" name="stress_level" required className="form-control" value={formData.stress_level} onChange={handleChange} min="1" max="10" placeholder="e.g. 5" />
              </div>
              <div className="input-group">
                <label>Motivation Level (1-10)</label>
                <input type="number" name="motivation" required className="form-control" value={formData.motivation} onChange={handleChange} min="1" max="10" placeholder="e.g. 8" />
              </div>
              <div className="input-group">
                <label>Class Participation (0-100)</label>
                <input type="number" name="participation" required className="form-control" value={formData.participation} onChange={handleChange} min="0" max="100" placeholder="e.g. 70" />
              </div>
              <div className="input-group">
                <label>Revision Frequency (0-10)</label>
                <input type="number" name="revision" required className="form-control" value={formData.revision} onChange={handleChange} min="0" max="10" placeholder="e.g. 6" />
              </div>
              <div className="input-group">
                <label>Exam Anxiety (1-10)</label>
                <input type="number" name="anxiety" required className="form-control" value={formData.anxiety} onChange={handleChange} min="1" max="10" placeholder="e.g. 4" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content" key="step-2">
            <div className="step-section-title"><Monitor size={18} /> Environment & Support</div>
            <p className="step-section-desc">Your study environment and available support.</p>
            <div className="predict-grid-2">
              <div className="input-group">
                <label>Internet Access</label>
                <select name="internet" className="form-control" value={formData.internet} onChange={handleChange}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="input-group">
                <label>Quiet Study Environment</label>
                <select name="quiet_study" className="form-control" value={formData.quiet_study} onChange={handleChange}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="input-group">
                <label>Extra Tutoring</label>
                <select name="tutoring" className="form-control" value={formData.tutoring} onChange={handleChange}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="input-group">
                <label>Family Support (1-10)</label>
                <input type="number" name="family_support" required className="form-control" value={formData.family_support} onChange={handleChange} min="1" max="10" placeholder="e.g. 8" />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content" key="step-3">
            <div className="step-section-title"><Shield size={18} /> Self-Confidence Assessment</div>
            <p className="step-section-desc">Rate your academic confidence levels (0-100).</p>
            <div className="predict-grid">
              <div className="input-group">
                <label>Confident in passing exams?</label>
                <input type="number" name="self_confidence_exam" required className="form-control" value={formData.self_confidence_exam} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Understanding class materials?</label>
                <input type="number" name="self_confidence_material" required className="form-control" value={formData.self_confidence_material} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Completing assignments on time?</label>
                <input type="number" name="self_confidence_assignments" required className="form-control" value={formData.self_confidence_assignments} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Solving difficult problems?</label>
                <input type="number" name="self_confidence_problems" required className="form-control" value={formData.self_confidence_problems} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>During presentations/discussions?</label>
                <input type="number" name="self_confidence_presentations" required className="form-control" value={formData.self_confidence_presentations} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
            </div>

            <div className="step-section-title" style={{ marginTop: '28px' }}><BookOpen size={18} /> Study Confidence</div>
            <p className="step-section-desc">Rate your study habit confidence (0-100).</p>
            <div className="predict-grid">
              <div className="input-group">
                <label>Daily study routine?</label>
                <input type="number" name="study_confidence_routine" required className="form-control" value={formData.study_confidence_routine} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Managing study time effectively?</label>
                <input type="number" name="study_confidence_time" required className="form-control" value={formData.study_confidence_time} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Preparing for exams without help?</label>
                <input type="number" name="study_confidence_no_help" required className="form-control" value={formData.study_confidence_no_help} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Learning new topics quickly?</label>
                <input type="number" name="study_confidence_new_topics" required className="form-control" value={formData.study_confidence_new_topics} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Maintaining focus while studying?</label>
                <input type="number" name="study_confidence_focus" required className="form-control" value={formData.study_confidence_focus} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content" key="step-4">
            <div className="step-section-title"><Sparkles size={18} /> Motivation & Discipline</div>
            <p className="step-section-desc">Rate your motivation and discipline levels (0-100).</p>
            <div className="predict-grid">
              <div className="input-group">
                <label>Motivated to achieve high grades?</label>
                <input type="number" name="motivation_high_grades" required className="form-control" value={formData.motivation_high_grades} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Avoiding distractions?</label>
                <input type="number" name="motivation_avoid_distractions" required className="form-control" value={formData.motivation_avoid_distractions} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Disciplined with revision?</label>
                <input type="number" name="discipline_revision" required className="form-control" value={formData.discipline_revision} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Balancing study & personal life?</label>
                <input type="number" name="motivation_balance" required className="form-control" value={formData.motivation_balance} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Staying consistent all semester?</label>
                <input type="number" name="motivation_consistency" required className="form-control" value={formData.motivation_consistency} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
            </div>

            <div className="step-section-title" style={{ marginTop: '28px' }}><Heart size={18} /> Mental & Emotional Readiness</div>
            <p className="step-section-desc">Rate your emotional preparedness (0-100).</p>
            <div className="predict-grid">
              <div className="input-group">
                <label>Handling exam pressure?</label>
                <input type="number" name="mental_handling_pressure" required className="form-control" value={formData.mental_handling_pressure} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Recovering from setbacks?</label>
                <input type="number" name="mental_recover_setbacks" required className="form-control" value={formData.mental_recover_setbacks} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Positive about academic future?</label>
                <input type="number" name="mental_future_positive" required className="form-control" value={formData.mental_future_positive} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Confidence during tests/quizzes?</label>
                <input type="number" name="mental_confidence_tests" required className="form-control" value={formData.mental_confidence_tests} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
              <div className="input-group">
                <label>Calm before examinations?</label>
                <input type="number" name="mental_calm_before_exam" required className="form-control" value={formData.mental_calm_before_exam} onChange={handleChange} min="0" max="100" placeholder="0-100" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="predict-page">
      {/* Header */}
      <div className="predict-header">
        <div className="predict-header-icon">
          <BrainCircuit size={28} />
        </div>
        <h2>Student Performance Predictor</h2>
        <p>Complete all sections for an AI-driven prediction of your academic outcome.</p>
      </div>

      {error && <div className="alert alert-error" style={{ maxWidth: '900px', margin: '0 auto 20px' }}>{error}</div>}

      {/* Step Indicator */}
      <div className="step-indicator">
        {STEPS.map((s, i) => (
          <div className="step-item" key={i}>
            <div className={`step-circle ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
              {i < step ? <CheckCircle size={16} /> : i + 1}
              <span className="step-label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-connector ${i < step ? 'active' : ''}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <div className="predict-form-card">
          {loading ? (
            <div className="predict-loading-overlay">
              <div className="predict-spinner"></div>
              <span className="predict-loading-text">Analyzing your data with AI...</span>
            </div>
          ) : (
            <>
              {renderStepContent()}

              {/* Navigation */}
              <div className="step-nav">
                {step > 0 ? (
                  <button type="button" className="btn-step btn-step-back" onClick={prevStep}>
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                <span className="step-nav-info">Step {step + 1} of {STEPS.length}</span>

                {step < STEPS.length - 1 ? (
                  <button type="button" className="btn-step btn-step-next" onClick={nextStep}>
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  <button type="submit" className="btn-step btn-step-submit" disabled={loading}>
                    <Send size={16} /> Analyze & Predict
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default PredictionForm;
