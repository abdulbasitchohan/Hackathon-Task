import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">🔑 Reset Password</h2>
      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          background: 'rgba(46, 204, 113, 0.2)',
          border: '1px solid #2ecc71',
          color: '#2ecc71',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>📧 Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={loading}
        >
          {loading ? '⏳ Sending...' : '📧 Send Reset Email'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/login" style={{ color: '#FFD700' }}>Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;