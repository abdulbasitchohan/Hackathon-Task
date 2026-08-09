import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext(null);

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      setIsAdmin(data?.role === 'admin');
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

 const signUp = async (email, password, userData) => {
  try {
    // Validate email
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new Error('Please enter a valid email address');
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: userData.full_name || '',
          age: userData.age || null,
          gender: userData.gender || 'male',
          height: userData.height || null,
          weight: userData.weight || null,
          goal: userData.goal || 'maintenance',
          fitness_level: userData.fitness_level || 'beginner'
        }
      }
    });

    if (error) {
      // Better error messages - NO 30 MINUTE WAIT
      if (error.message.includes('Email address')) {
        throw new Error('Invalid email format. Please enter a valid email address.');
      }
      if (error.message.includes('already')) {
        throw new Error('This email is already registered. Please login.');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Too many attempts. Please try again in a few minutes.');
      }
      throw error;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: cleanEmail,
          full_name: userData.full_name || '',
          age: userData.age || null,
          gender: userData.gender || 'male',
          height: userData.height || null,
          weight: userData.weight || null,
          goal: userData.goal || 'maintenance',
          fitness_level: userData.fitness_level || 'beginner',
          role: 'user'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    toast.success('Registration successful! Please verify your email.');
    return data;
  } catch (error) {
    console.error('SignUp error:', error);
    toast.error(error.message || 'Registration failed');
    throw error;
  }
};

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);

      toast.success('Welcome back!');
      return data;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      setProfile(prev => ({ ...prev, ...updates }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    fetchProfile
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export { AuthContext };