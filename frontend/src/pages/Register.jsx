import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, BookOpen, CheckCircle, Image, Eye, EyeOff } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'student', major: '', profile_image: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (res.data.recommendation) {
        setRecommendation(res.data.recommendation);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="glass-panel p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-purple-500/20 text-purple-400 mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 mt-2">Register now to unlock personalized AI predictions, track statistics, and get customized study recommendations!</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {recommendation ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="inline-block p-3 rounded-full bg-green-500/20 text-green-400 mb-4">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Account Created!</h3>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/30 text-left mb-6">
              <h4 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                <BookOpen size={18} /> Initial Recommendations for {formData.major || 'You'}
              </h4>
              <p className="text-gray-300 leading-relaxed text-sm">{recommendation}</p>
            </div>
            <button onClick={() => navigate('/login')} className="btn btn-primary w-full py-3">
              Continue to Login
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                name="username"
                required
                className="form-control pl-10"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Field of Study (Major)</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                name="major"
                className="form-control pl-10"
                placeholder="e.g. Computer Science"
                value={formData.major}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                required
                className="form-control pl-10"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                required
                className="form-control pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>Profile Image (Optional)</label>
            <div className="relative">
              <Image className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input
                type="file"
                accept="image/*"
                className="form-control pl-10"
                onChange={handleImageChange}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? <div className="loader" /> : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Log in</Link>
        </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
