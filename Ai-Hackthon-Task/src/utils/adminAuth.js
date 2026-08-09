import { supabase } from './supabaseClient';

// Admin create user (bypasses rate limit)
export const adminCreateUser = async (email, password, userData) => {
  try {
    // First, check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: userData.full_name || '',
          age: userData.age || null,
          gender: userData.gender || 'male',
          height: userData.height || null,
          weight: userData.weight || null,
          goal: userData.goal || 'maintenance'
        }
      }
    });

    if (error) {
      if (error.message.includes('rate limit')) {
        throw new Error('Too many registration attempts. Please wait 30 minutes and try again.');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Admin create user error:', error);
    throw error;
  }
};