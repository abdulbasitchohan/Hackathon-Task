import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#FFD700' }}>⏳ Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;