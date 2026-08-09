import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const HabitTracker = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState({
    meals_logged: false,
    water_intake_ml: 0,
    workout_completed: false,
    sleep_hours: 0,
    mood: 'good',
    calories_consumed: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTodayHabits();
  }, [user]);

  const fetchTodayHabits = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHabits(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const today = new Date().toISOString().split('T')[0];
      const habitData = {
        ...habits,
        user_id: user.id,
        date: today,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('daily_habits')
        .upsert(habitData, { onConflict: 'user_id,date' });

      if (error) throw error;
      setMessage('✅ Habits saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving habits:', error);
      setMessage('❌ Failed to save habits');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#FFD700' }}>⏳ Loading habits...</div>;
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
        <h2 style={{ color: '#FFD700' }}>📊 Daily Habits</h2>
        <p style={{ color: '#888' }}>Track your daily fitness habits</p>
      </div>

      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          background: message.includes('✅') ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
          border: `1px solid ${message.includes('✅') ? '#2ecc71' : '#e74c3c'}`,
          color: message.includes('✅') ? '#2ecc71' : '#e74c3c',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: 'rgba(26,26,46,0.9)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,215,0,0.1)'
      }}>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="meals_logged"
              checked={habits.meals_logged}
              onChange={handleChange}
            />
            ✅ Meals Logged
          </label>
        </div>

        <div className="form-group">
          <label>💧 Water Intake (ml)</label>
          <input
            type="number"
            name="water_intake_ml"
            value={habits.water_intake_ml || 0}
            onChange={handleChange}
            placeholder="Enter water in ml"
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="workout_completed"
              checked={habits.workout_completed}
              onChange={handleChange}
            />
            💪 Workout Completed
          </label>
        </div>

        <div className="form-group">
          <label>😴 Sleep Hours</label>
          <input
            type="number"
            name="sleep_hours"
            value={habits.sleep_hours || 0}
            onChange={handleChange}
            placeholder="Hours of sleep"
            step="0.5"
          />
        </div>

        <div className="form-group">
          <label>😊 Mood</label>
          <select name="mood" value={habits.mood || 'good'} onChange={handleChange}>
            <option value="great">Great</option>
            <option value="good">Good</option>
            <option value="okay">Okay</option>
            <option value="bad">Bad</option>
            <option value="terrible">Terrible</option>
          </select>
        </div>

        <div className="form-group">
          <label>🔥 Calories Consumed</label>
          <input
            type="number"
            name="calories_consumed"
            value={habits.calories_consumed || 0}
            onChange={handleChange}
            placeholder="Calories consumed today"
          />
        </div>

        <div className="form-group">
          <label>📝 Notes</label>
          <textarea
            name="notes"
            value={habits.notes || ''}
            onChange={handleChange}
            placeholder="Any additional notes..."
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={saving}
        >
          {saving ? '⏳ Saving...' : '💾 Save Habits'}
        </button>
      </form>
    </div>
  );
};

export default HabitTracker;