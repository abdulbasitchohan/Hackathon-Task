import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    goal: 'maintenance',
    fitness_level: 'beginner'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError('❌ Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('❌ Password must be at least 6 characters!');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('❌ Please enter a valid email address');
      return;
    }

    if (!formData.full_name.trim()) {
      setError('❌ Please enter your full name!');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      
      const cleanUserData = {};
      Object.keys(userData).forEach(key => {
        if (userData[key] !== '' && userData[key] !== null && userData[key] !== undefined) {
          cleanUserData[key] = userData[key];
        }
      });

      await signUp(formData.email.trim().toLowerCase(), formData.password, cleanUserData);
      
      setSuccess('✅ Registration successful! Please check your email to verify your account.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message.includes('rate limit') || error.message.includes('too many')) {
        setError('⏳ Too many registration attempts. Please try again in a few minutes.');
      } else if (error.message.includes('already registered') || error.message.includes('already exists')) {
        setError('📧 This email is already registered. Please login instead.');
      } else if (error.message.includes('Email address')) {
        setError('❌ The email address is invalid. Please check and try again.');
      } else {
        setError(`❌ ${error.message || 'Registration failed. Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '650px', padding: '2.5rem' }}>
      <h2 className="form-title">📝 Create Account</h2>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '2rem' }}>
        Join AI Fitness Coach and start your journey
      </p>

      {error && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          background: error.includes('⏳') ? 'rgba(243, 156, 18, 0.2)' : 'rgba(231, 76, 60, 0.2)',
          border: `1px solid ${error.includes('⏳') ? '#f39c12' : '#e74c3c'}`,
          color: error.includes('⏳') ? '#f39c12' : '#e74c3c',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          background: 'rgba(46, 204, 113, 0.2)',
          border: '1px solid #2ecc71',
          color: '#2ecc71',
          textAlign: 'center'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div style={{
          background: 'rgba(255,215,0,0.05)',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid rgba(255,215,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem' }}>👤 Personal Information</h4>
          
          <div className="form-group">
            <label>👤 Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label>📧 Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div className="form-group">
            <label>🔑 Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Min 6 characters"
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label>🔑 Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
        </div>

        {/* Physical Information */}
        <div style={{
          background: 'rgba(52, 152, 219, 0.05)',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid rgba(52, 152, 219, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ color: '#3498db', marginBottom: '1rem', fontSize: '1rem' }}>📊 Physical Information</h4>
          
          <div className="form-group">
            <label>🎂 Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Your age"
              min="12"
              max="100"
            />
          </div>
          
          <div className="form-group">
            <label>⚥ Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>📏 Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="e.g., 175"
              step="0.1"
            />
          </div>
          
          <div className="form-group">
            <label>⚖️ Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g., 75"
              step="0.1"
            />
          </div>
        </div>

        {/* Fitness Information */}
        <div style={{
          background: 'rgba(46, 204, 113, 0.05)',
          padding: '1.5rem',
          borderRadius: '10px',
          border: '1px solid rgba(46, 204, 113, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ color: '#2ecc71', marginBottom: '1rem', fontSize: '1rem' }}>🎯 Fitness Information</h4>
          
          <div className="form-group">
            <label>🎯 Fitness Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange}>
              <option value="weight_loss">Weight Loss</option>
              <option value="weight_gain">Weight Gain</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>💪 Fitness Level</label>
            <select name="fitness_level" value={formData.fitness_level} onChange={handleChange}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          style={{ 
            width: '100%', 
            justifyContent: 'center',
            padding: '1rem',
            fontSize: '1.1rem'
          }}
          disabled={loading}
        >
          {loading ? '⏳ Creating Account...' : '📝 Create Account'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link to="/login" style={{ color: '#FFD700' }}>
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Register;