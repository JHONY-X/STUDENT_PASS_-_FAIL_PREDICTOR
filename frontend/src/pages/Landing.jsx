import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Moon, Sun, ArrowRight, MessageSquare, Calendar, TrendingUp, Sparkles, Users, Send, X } from 'lucide-react';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);

  return (
    <div className="landing-container">
      {/* Navbar */}
      <header className="landing-header">
        <div className="landing-logo">
          <Brain className="logo-icon" />
          <span>NeuroGrade AI</span>
        </div>
        <nav className="landing-nav">
          <Link to="/" className="active">Home</Link>
          <a href="#features" onClick={(e) => { e.preventDefault(); setShowFeaturesModal(true); }}>Features</a>
          <Link to="/about">About</Link>
          <a href="#contact" onClick={(e) => { e.preventDefault(); setShowContactsModal(true); }}>Contact</a>
        </nav>
        <div className="landing-nav-actions">
          <button className="theme-toggle" aria-label="Toggle theme">
            <Moon size={18} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Predict. Analyze.<br />
            <span className="gradient-text">Elevate.</span>
          </h1>
          <p className="hero-subtitle">
            AI-Powered Student Pass/Fail Prediction for a Smarter Tomorrow.
          </p>

          <div className="hero-actions">
            {token ? (
              <>
                <Link to="/home" className="btn-signup">
                  Go to Dashboard <ArrowRight size={18} />
                </Link>
                <Link to="/predict" className="btn-login">
                  Start Prediction
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login">
                  Login
                </Link>
                <Link to="/register" className="btn-signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-visual-container">
          <div className="hero-glow-effect"></div>
          <img 
            src="/neurograde_landing_mockup.png" 
            alt="NeuroGrade AI Platform Mockup" 
            className="hero-mockup-img"
          />
        </div>
      </main>

      {/* Stats Row */}
      <section className="landing-stats">
        <div className="stat-item">
          <span className="stat-number">98.6%</span>
          <span className="stat-label">Prediction Accuracy</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">10K+</span>
          <span className="stat-label">Students Analyzed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">120+</span>
          <span className="stat-label">AI Insights</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-label">AI Support</span>
        </div>
      </section>

      {/* ─── UPCOMING FEATURES MODAL ─── */}
      {showFeaturesModal && (
        <div className="landing-modal-overlay animate-in fade-in duration-300" onClick={() => setShowFeaturesModal(false)}>
          <div className="landing-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowFeaturesModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <Sparkles className="modal-title-icon text-purple-400" />
              <h3 className="modal-title text-2xl font-bold">Upcoming AI Features</h3>
            </div>
            <p className="modal-subtitle text-gray-400">
              We are continuously evolving. Here is a sneak peek at the cutting-edge features arriving in the next major update:
            </p>
            <div className="features-grid">
              <div className="feature-item-card">
                <div className="feature-icon-wrapper purple-bg">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="feature-item-title text-white font-semibold">Chat with AI Companion</h4>
                  <p className="feature-item-desc text-gray-400 text-sm">
                    Chat with an intelligent academic advisor that understands your predictive scores and recommends tailored daily study strategies for a better learning experience.
                  </p>
                </div>
              </div>

              <div className="feature-item-card">
                <div className="feature-icon-wrapper blue-bg">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="feature-item-title text-white font-semibold">Real-Time Grade Analytics</h4>
                  <p className="feature-item-desc text-gray-400 text-sm">
                    Connect your university gradebook and visualize your performance trends and projected final scores dynamically.
                  </p>
                </div>
              </div>

              <div className="feature-item-card">
                <div className="feature-icon-wrapper green-bg">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="feature-item-title text-white font-semibold">Smart Calendar & Study Timers</h4>
                  <p className="feature-item-desc text-gray-400 text-sm">
                    Get custom study calendar generation integrated with a built-in Pomodoro system tailored directly to your high-stress weeks.
                  </p>
                </div>
              </div>

              <div className="feature-item-card">
                <div className="feature-icon-wrapper pink-bg">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="feature-item-title text-white font-semibold">Collaborative Peer Study Hubs</h4>
                  <p className="feature-item-desc text-gray-400 text-sm">
                    Instantly match and study with peers of similar majors, sharing anonymized wellness and study statistics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONTACTS / TELEGRAM SUPPORT MODAL ─── */}
      {showContactsModal && (
        <div className="landing-modal-overlay animate-in fade-in duration-300" onClick={() => setShowContactsModal(false)}>
          <div className="landing-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowContactsModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <Send className="modal-title-icon text-blue-400" />
              <h3 className="modal-title text-2xl font-bold">Contact Our Developers</h3>
            </div>
            <p className="modal-subtitle text-gray-400">
              Have questions, feedback, or need support? Reach out directly to our engineering team on Telegram:
            </p>
            <div className="contacts-list">
              <a href="https://t.me/Yoni_yoi" target="_blank" rel="noopener noreferrer" className="contact-link-card">
                <div className="contact-avatar">Y</div>
                <div className="contact-info">
                  <span className="contact-name text-white font-semibold">Yoni</span>
                  <span className="contact-role text-gray-400 text-sm">Lead UI/UX Designer</span>
                </div>
                <div className="telegram-badge">@Yoni_yoi</div>
              </a>

              <a href="https://t.me/H3B6M9" target="_blank" rel="noopener noreferrer" className="contact-link-card">
                <div className="contact-avatar">H</div>
                <div className="contact-info">
                  <span className="contact-name text-white font-semibold">H3B</span>
                  <span className="contact-role text-gray-400 text-sm">Lead Backend Architect</span>
                </div>
                <div className="telegram-badge">@H3B6M9</div>
              </a>

              <a href="https://t.me/juccj" target="_blank" rel="noopener noreferrer" className="contact-link-card">
                <div className="contact-avatar">J</div>
                <div className="contact-info">
                  <span className="contact-name text-white font-semibold">Juccj</span>
                  <span className="contact-role text-gray-400 text-sm">Lead AI Architect</span>
                </div>
                <div className="telegram-badge">@juccj</div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
