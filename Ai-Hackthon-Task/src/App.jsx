import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Home Page
import Home from './components/Home';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// User Pages
import Dashboard from './components/user/Dashboard';
import Profile from './components/user/Profile';
import DietPlan from './components/user/DietPlan';
import WorkoutPlan from './components/user/WorkoutPlan';
import HabitTracker from './components/user/HabitTracker';
import AIChatbot from './components/user/AIChatbot';
import Onboarding from './components/user/Onboarding';

// Admin Pages
import AdminDashboard from './components/admin/AdminDashboard';

import './App.css'; // ← This is where CSS should be imported

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#F5A623' }}>Loading...</div>;
  }
  return isAdmin ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<Home />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected User Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              <Route path="/onboarding" element={
                <ProtectedRoute><Onboarding /></ProtectedRoute>
              } />

              <Route path="/diet-plan" element={
                <ProtectedRoute><DietPlan /></ProtectedRoute>
              } />
              
              <Route path="/workout-plan" element={
                <ProtectedRoute><WorkoutPlan /></ProtectedRoute>
              } />
              
              <Route path="/habits" element={
                <ProtectedRoute><HabitTracker /></ProtectedRoute>
              } />
              
              <Route path="/chat" element={
                <ProtectedRoute><AIChatbot /></ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;