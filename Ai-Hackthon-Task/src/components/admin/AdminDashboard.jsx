import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { profile } = useAuth();

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(26,26,46,0.95))',
        padding: '2rem',
        borderRadius: '15px',
        border: '2px solid #FFD700',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#FFD700' }}>🛡️ Admin Dashboard</h2>
        <p style={{ color: '#888' }}>Welcome, {profile?.full_name || 'Admin'}!</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(26,26,46,0.9)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,215,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem' }}>👥</div>
          <div style={{ color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold' }}>0</div>
          <div style={{ color: '#888' }}>Total Users</div>
        </div>
        <div style={{
          background: 'rgba(26,26,46,0.9)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(52, 152, 219, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem' }}>📊</div>
          <div style={{ color: '#3498db', fontSize: '1.5rem', fontWeight: 'bold' }}>0%</div>
          <div style={{ color: '#888' }}>Completion Rate</div>
        </div>
        <div style={{
          background: 'rgba(26,26,46,0.9)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(46, 204, 113, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem' }}>💬</div>
          <div style={{ color: '#2ecc71', fontSize: '1.5rem', fontWeight: 'bold' }}>0</div>
          <div style={{ color: '#888' }}>Total Chats</div>
        </div>
        <div style={{
          background: 'rgba(26,26,46,0.9)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(231, 76, 60, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <div style={{ color: '#e74c3c', fontSize: '1.5rem', fontWeight: 'bold' }}>0</div>
          <div style={{ color: '#888' }}>Flagged Content</div>
        </div>
      </div>

      <div style={{
        background: 'rgba(26,26,46,0.8)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,215,0,0.1)'
      }}>
        <h3 style={{ color: '#FFD700', marginBottom: '1rem' }}>📋 Quick Actions</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <button style={{
            padding: '1rem',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid #FFD700',
            borderRadius: '8px',
            color: '#FFD700',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,215,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
          }}>
            👥 Manage Users
          </button>
          <button style={{
            padding: '1rem',
            background: 'rgba(52, 152, 219, 0.1)',
            border: '1px solid #3498db',
            borderRadius: '8px',
            color: '#3498db',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(52, 152, 219, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(52, 152, 219, 0.1)';
          }}>
            📊 View Analytics
          </button>
          <button style={{
            padding: '1rem',
            background: 'rgba(46, 204, 113, 0.1)',
            border: '1px solid #2ecc71',
            borderRadius: '8px',
            color: '#2ecc71',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(46, 204, 113, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(46, 204, 113, 0.1)';
          }}>
            🧠 AI Controls
          </button>
          <button style={{
            padding: '1rem',
            background: 'rgba(155, 89, 182, 0.1)',
            border: '1px solid #9b59b6',
            borderRadius: '8px',
            color: '#9b59b6',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(155, 89, 182, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(155, 89, 182, 0.1)';
          }}>
            📸 Image Moderation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;