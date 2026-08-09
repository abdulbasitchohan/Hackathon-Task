import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>📧 Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
        </div>
        <div className="form-group">
          <label>🔑 Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? '⏳ Logging in...' : '🔐 Login'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/register" style={{ color: '#FFD700' }}>Don't have an account? Register</Link>
        <br />
        <Link to="/forgot-password" style={{ color: '#888', fontSize: '0.9rem' }}>Forgot password?</Link>
      </div>
    </div>
  );
};

export default Login;