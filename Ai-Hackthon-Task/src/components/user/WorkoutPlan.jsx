import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const WorkoutPlan = () => {
  const { user } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutPlan();
  }, [user]);

  const fetchWorkoutPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      setWorkoutPlan(data?.[0] || null);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#FFD700' }}>⏳ Loading workout plan...</div>;
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(26,26,46,0.9))',
        padding: '2rem',
        borderRadius: '15px',
        border: '1px solid rgba(255,215,0,0.2)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#FFD700' }}>💪 Your Workout Plan</h2>
        <p style={{ color: '#888' }}>Personalized workout routine based on your goals</p>
      </div>

      {!workoutPlan ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(26,26,46,0.5)',
          borderRadius: '15px',
          border: '1px dashed rgba(255,215,0,0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏋️</div>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>No workout plan generated yet.</p>
          <p style={{ color: '#555' }}>Complete your profile to get a personalized workout plan!</p>
        </div>
      ) : (
        <div style={{
          background: 'rgba(26,26,46,0.9)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,215,0,0.1)'
        }}>
          <h3 style={{ color: '#FFD700' }}>{workoutPlan.name}</h3>
          <p style={{ color: '#888' }}>{workoutPlan.description}</p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              padding: '0.2rem 0.8rem',
              borderRadius: '20px',
              background: 'rgba(52, 152, 219, 0.2)',
              color: '#3498db',
              border: '1px solid #3498db'
            }}>
              {workoutPlan.type || 'Gym'}
            </span>
            <span style={{
              padding: '0.2rem 0.8rem',
              borderRadius: '20px',
              background: 'rgba(46, 204, 113, 0.2)',
              color: '#2ecc71',
              border: '1px solid #2ecc71'
            }}>
              {workoutPlan.difficulty || 'Beginner'}
            </span>
          </div>
          {workoutPlan.weekly_split && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: '#FFD700' }}>Weekly Schedule</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {JSON.parse(workoutPlan.weekly_split).map((day, index) => (
                  <div key={index} style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,215,0,0.1)'
                  }}>
                    <strong style={{ color: '#FFD700' }}>{day.day}</strong>
                    <div style={{ color: '#aaa', marginTop: '0.3rem' }}>
                      {day.exercises?.map((ex, i) => (
                        <div key={i}>• {ex.name} - {ex.sets}×{ex.reps}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;