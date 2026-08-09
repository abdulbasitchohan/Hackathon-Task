import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { Link } from 'react-router-dom';
import {
  RiFireLine,
  RiCalendarLine,
  RiRunLine,
  RiChatAiLine,
  RiRestaurantLine,
  RiArrowRightLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiCheckLine,
  RiWaterFlashLine,
  RiMoonLine,
  RiEmotionLine
} from '@remixicon/react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState({
    meals_logged: false,
    water_intake_ml: 0,
    workout_completed: false,
    sleep_hours: 0,
    mood: 'good',
    calories_consumed: 0,
    notes: '',
    streak_days: 0
  });
  const [dietPlans, setDietPlans] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddDiet, setShowAddDiet] = useState(false);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // New Diet Form
  const [newDiet, setNewDiet] = useState({
    name: '',
    description: '',
    total_calories: '',
    protein_grams: '',
    carbs_grams: '',
    fat_grams: '',
    meals: [{ name: '', time: '', foods: '' }]
  });

  // New Workout Form
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    type: 'gym',
    difficulty: 'beginner',
    weekly_split: [{ day: '', exercises: [{ name: '', sets: '', reps: '', notes: '' }] }]
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's habits
      const { data: habitData } = await supabase
        .from('daily_habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (habitData) setHabits(habitData);

      // Fetch diet plans
      const { data: dietData } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setDietPlans(dietData || []);

      // Fetch workout plans
      const { data: workoutData } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setWorkoutPlans(workoutData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HABIT FUNCTIONS
  // ============================================
  const saveHabit = async () => {
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
      toast.success('✅ Habit saved successfully!');
      setShowAddHabit(false);
      fetchDashboardData();
    } catch (error) {
      toast.error('❌ Failed to save habit');
      console.error(error);
    }
  };

  // ============================================
  // DIET PLAN FUNCTIONS
  // ============================================
  const addDietPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .insert({
          user_id: user.id,
          name: newDiet.name,
          description: newDiet.description,
          total_calories: parseInt(newDiet.total_calories) || 0,
          protein_grams: parseInt(newDiet.protein_grams) || 0,
          carbs_grams: parseInt(newDiet.carbs_grams) || 0,
          fat_grams: parseInt(newDiet.fat_grams) || 0,
          meals: JSON.stringify(newDiet.meals),
          is_ai_generated: false,
          is_active: true,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('✅ Diet plan added!');
      setShowAddDiet(false);
      setNewDiet({ name: '', description: '', total_calories: '', protein_grams: '', carbs_grams: '', fat_grams: '', meals: [{ name: '', time: '', foods: '' }] });
      fetchDashboardData();
    } catch (error) {
      toast.error('❌ Failed to add diet plan');
      console.error(error);
    }
  };

  const deleteDietPlan = async (id) => {
    if (!window.confirm('Delete this diet plan?')) return;
    try {
      const { error } = await supabase
        .from('diet_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('✅ Diet plan deleted');
      fetchDashboardData();
    } catch (error) {
      toast.error('❌ Failed to delete');
      console.error(error);
    }
  };

  // ============================================
  // WORKOUT PLAN FUNCTIONS
  // ============================================
  const addWorkoutPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          name: newWorkout.name,
          description: newWorkout.description,
          type: newWorkout.type,
          difficulty: newWorkout.difficulty,
          weekly_split: JSON.stringify(newWorkout.weekly_split),
          is_ai_generated: false,
          is_active: true,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('✅ Workout plan added!');
      setShowAddWorkout(false);
      setNewWorkout({ name: '', description: '', type: 'gym', difficulty: 'beginner', weekly_split: [{ day: '', exercises: [{ name: '', sets: '', reps: '', notes: '' }] }] });
      fetchDashboardData();
    } catch (error) {
      toast.error('❌ Failed to add workout plan');
      console.error(error);
    }
  };

  const deleteWorkoutPlan = async (id) => {
    if (!window.confirm('Delete this workout plan?')) return;
    try {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('✅ Workout plan deleted');
      fetchDashboardData();
    } catch (error) {
      toast.error('❌ Failed to delete');
      console.error(error);
    }
  };

  const habitFields = [
    { key: 'meals_logged', label: 'Meals Logged', type: 'checkbox' },
    { key: 'water_intake_ml', label: 'Water (ml)', type: 'number', placeholder: 'e.g., 2000' },
    { key: 'workout_completed', label: 'Workout Done', type: 'checkbox' },
    { key: 'sleep_hours', label: 'Sleep Hours', type: 'number', placeholder: 'e.g., 8' },
    { key: 'calories_consumed', label: 'Calories Consumed', type: 'number', placeholder: 'e.g., 2000' },
    { key: 'mood', label: 'Mood', type: 'select', options: ['great', 'good', 'okay', 'bad', 'terrible'] },
    { key: 'notes', label: 'Notes', type: 'textarea', placeholder: 'How was your day?' }
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#F5A623' }}>⏳ Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: '1rem 0' }}>
      {/* Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(10,10,15,0.95))',
        padding: '1.5rem 2rem',
        borderRadius: '16px',
        border: '1px solid rgba(245,166,35,0.1)',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ color: '#FFFFFF', marginBottom: '0.3rem', fontSize: 'clamp(1.3rem, 2vw, 1.8rem)' }}>
            Welcome back, {profile?.full_name || 'User'}! 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {profile?.goal ? `🎯 Goal: ${profile.goal.replace('_', ' ').toUpperCase()}` : 'Set your fitness goal'}
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: '0.8rem',
          flexWrap: 'wrap'
        }}>
          <span style={{
            padding: '0.3rem 1rem',
            borderRadius: '20px',
            background: 'rgba(245,166,35,0.12)',
            border: '1px solid rgba(245,166,35,0.2)',
            color: '#F5A623',
            fontSize: '0.85rem'
          }}>
            🔥 {habits.streak_days || 0} Day Streak
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '1.8rem' }}>🍽️</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Diet Plans</div>
          <div style={{ color: '#F5A623', fontSize: '1.5rem', fontWeight: 'bold' }}>{dietPlans.length}</div>
        </div>
        <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '1.8rem' }}>💪</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Workout Plans</div>
          <div style={{ color: '#4A9EFF', fontSize: '1.5rem', fontWeight: 'bold' }}>{workoutPlans.length}</div>
        </div>
        <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '1.8rem' }}>💧</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Water Today</div>
          <div style={{ color: '#34D399', fontSize: '1.2rem', fontWeight: 'bold' }}>{habits.water_intake_ml || 0}ml</div>
        </div>
        <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '1.8rem' }}>😴</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Sleep</div>
          <div style={{ color: '#A78BFA', fontSize: '1.2rem', fontWeight: 'bold' }}>{habits.sleep_hours || 0}h</div>
        </div>
      </div>

      {/* ============================================
          ADD HABIT SECTION
          ============================================ */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem' }}>📊 Today's Habits</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddHabit(!showAddHabit)}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            {showAddHabit ? <RiCloseLine size={18} /> : <RiAddLine size={18} />}
            {showAddHabit ? 'Close' : 'Add Habit'}
          </button>
        </div>

        {showAddHabit && (
          <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.04)',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}>
              {habitFields.map((field) => (
                <div key={field.key} className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>{field.label}</label>
                  {field.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={habits[field.key] || false}
                      onChange={(e) => setHabits({ ...habits, [field.key]: e.target.checked })}
                      style={{ width: 'auto', marginTop: '0.3rem' }}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={habits[field.key] || ''}
                      onChange={(e) => setHabits({ ...habits, [field.key]: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                    >
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={habits[field.key] || ''}
                      onChange={(e) => setHabits({ ...habits, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows="2"
                      style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={habits[field.key] || ''}
                      onChange={(e) => setHabits({ ...habits, [field.key]: field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                      placeholder={field.placeholder}
                      style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary"
              onClick={saveHabit}
              style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            >
              💾 Save Habits
            </button>
          </div>
        )}

        {/* Display current habits summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '0.8rem'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem' }}>{habits.meals_logged ? '✅' : '⏳'}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Meals</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem' }}>{habits.workout_completed ? '✅' : '⏳'}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Workout</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: '#F5A623' }}>{habits.calories_consumed || 0}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Calories</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: '#34D399' }}>{habits.water_intake_ml || 0}ml</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Water</div>
          </div>
        </div>
      </div>

      {/* ============================================
          DIET PLANS SECTION
          ============================================ */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem' }}>🍽️ My Diet Plans</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddDiet(!showAddDiet)}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            {showAddDiet ? <RiCloseLine size={18} /> : <RiAddLine size={18} />}
            {showAddDiet ? 'Close' : 'Add Diet Plan'}
          </button>
        </div>

        {showAddDiet && (
          <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.04)',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Plan Name *</label>
                <input
                  type="text"
                  value={newDiet.name}
                  onChange={(e) => setNewDiet({ ...newDiet, name: e.target.value })}
                  placeholder="e.g., Keto Diet"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Description</label>
                <input
                  type="text"
                  value={newDiet.description}
                  onChange={(e) => setNewDiet({ ...newDiet, description: e.target.value })}
                  placeholder="Brief description"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Calories</label>
                <input
                  type="number"
                  value={newDiet.total_calories}
                  onChange={(e) => setNewDiet({ ...newDiet, total_calories: e.target.value })}
                  placeholder="e.g., 2000"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Protein (g)</label>
                <input
                  type="number"
                  value={newDiet.protein_grams}
                  onChange={(e) => setNewDiet({ ...newDiet, protein_grams: e.target.value })}
                  placeholder="e.g., 150"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Carbs (g)</label>
                <input
                  type="number"
                  value={newDiet.carbs_grams}
                  onChange={(e) => setNewDiet({ ...newDiet, carbs_grams: e.target.value })}
                  placeholder="e.g., 200"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Fat (g)</label>
                <input
                  type="number"
                  value={newDiet.fat_grams}
                  onChange={(e) => setNewDiet({ ...newDiet, fat_grams: e.target.value })}
                  placeholder="e.g., 70"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={addDietPlan}
              style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            >
              ➕ Add Diet Plan
            </button>
          </div>
        )}

        {/* Diet Plans List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {dietPlans.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px dashed rgba(255,255,255,0.06)'
            }}>
              No diet plans yet. Add your first one!
            </div>
          ) : (
            dietPlans.map((plan) => (
              <div key={plan.id} style={{
                background: 'var(--bg-card)',
                padding: '1.2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.04)',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(245,166,35,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4 style={{ color: '#F5A623', marginBottom: '0.2rem' }}>{plan.name}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{plan.description}</p>
                  </div>
                  <button
                    onClick={() => deleteDietPlan(plan.id)}
                    style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer' }}
                  >
                    <RiDeleteBinLine size={18} />
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(245,166,35,0.1)', borderRadius: '12px', color: '#F5A623' }}>
                    🔥 {plan.total_calories} cal
                  </span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(52,211,153,0.1)', borderRadius: '12px', color: '#34D399' }}>
                    💪 {plan.protein_grams}g protein
                  </span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(74,158,255,0.1)', borderRadius: '12px', color: '#4A9EFF' }}>
                    🍞 {plan.carbs_grams}g carbs
                  </span>
                </div>
                {plan.is_ai_generated && (
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
                    🤖 AI Generated
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ============================================
          WORKOUT PLANS SECTION
          ============================================ */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem' }}>💪 My Workout Plans</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddWorkout(!showAddWorkout)}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            {showAddWorkout ? <RiCloseLine size={18} /> : <RiAddLine size={18} />}
            {showAddWorkout ? 'Close' : 'Add Workout'}
          </button>
        </div>

        {showAddWorkout && (
          <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.04)',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Plan Name *</label>
                <input
                  type="text"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                  placeholder="e.g., Push Day"
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Type</label>
                <select
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="gym">Gym</option>
                  <option value="home">Home</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.8rem' }}>Difficulty</label>
                <select
                  value={newWorkout.difficulty}
                  onChange={(e) => setNewWorkout({ ...newWorkout, difficulty: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={addWorkoutPlan}
              style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            >
              ➕ Add Workout Plan
            </button>
          </div>
        )}

        {/* Workout Plans List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {workoutPlans.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px dashed rgba(255,255,255,0.06)'
            }}>
              No workout plans yet. Add your first one!
            </div>
          ) : (
            workoutPlans.map((plan) => (
              <div key={plan.id} style={{
                background: 'var(--bg-card)',
                padding: '1.2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.04)',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(74,158,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4 style={{ color: '#4A9EFF', marginBottom: '0.2rem' }}>{plan.name}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{plan.description}</p>
                  </div>
                  <button
                    onClick={() => deleteWorkoutPlan(plan.id)}
                    style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer' }}
                  >
                    <RiDeleteBinLine size={18} />
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(74,158,255,0.1)', borderRadius: '12px', color: '#4A9EFF' }}>
                    {plan.type === 'gym' ? '🏋️ Gym' : '🏠 Home'}
                  </span>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(167,139,250,0.1)', borderRadius: '12px', color: '#A78BFA' }}>
                    {plan.difficulty}
                  </span>
                </div>
                {plan.is_ai_generated && (
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
                    🤖 AI Generated
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <Link to="/diet-plan" style={{
          textDecoration: 'none',
          background: 'rgba(245,166,35,0.05)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(245,166,35,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          transition: 'var(--transition)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#F5A623';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(245,166,35,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <RiRestaurantLine size={24} color="#F5A623" />
          <div>
            <div style={{ color: '#F5A623', fontWeight: 'bold' }}>View Diet Plans</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{dietPlans.length} plans</div>
          </div>
        </Link>

        <Link to="/workout-plan" style={{
          textDecoration: 'none',
          background: 'rgba(74,158,255,0.05)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(74,158,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          transition: 'var(--transition)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#4A9EFF';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(74,158,255,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <RiRunLine size={24} color="#4A9EFF" />
          <div>
            <div style={{ color: '#4A9EFF', fontWeight: 'bold' }}>View Workout Plans</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{workoutPlans.length} plans</div>
          </div>
        </Link>

        <Link to="/chat" style={{
          textDecoration: 'none',
          background: 'rgba(167,139,250,0.05)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(167,139,250,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          transition: 'var(--transition)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#A78BFA';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(167,139,250,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <RiChatAiLine size={24} color="#A78BFA" />
          <div>
            <div style={{ color: '#A78BFA', fontWeight: 'bold' }}>AI Chat</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Get fitness advice</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;