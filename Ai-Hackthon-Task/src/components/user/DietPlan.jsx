import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const DietPlan = () => {
  const { user } = useAuth();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietPlan();
  }, [user]);

  const fetchDietPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      setDietPlan(data?.[0] || null);
    } catch (error) {
      console.error('Error fetching diet plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#FFD700' }}>⏳ Loading diet plan...</div>;
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
        <h2 style={{ color: '#FFD700' }}>🥗 Your Diet Plan</h2>
        <p style={{ color: '#888' }}>Personalized meal plan based on your goals</p>
      </div>

      {!dietPlan ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(26,26,46,0.5)',
          borderRadius: '15px',
          border: '1px dashed rgba(255,215,0,0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>No diet plan generated yet.</p>
          <p style={{ color: '#555' }}>Complete your profile to get a personalized diet plan!</p>
        </div>
      ) : (
        <div style={{
          background: 'rgba(26,26,46,0.9)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,215,0,0.1)'
        }}>
          <h3 style={{ color: '#FFD700' }}>{dietPlan.name}</h3>
          <p style={{ color: '#888' }}>{dietPlan.description}</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: '#888' }}>Calories</div>
              <div style={{ color: '#FFD700', fontWeight: 'bold' }}>{dietPlan.total_calories || '--'}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: '#888' }}>Protein</div>
              <div style={{ color: '#2ecc71', fontWeight: 'bold' }}>{dietPlan.protein_grams || '--'}g</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: '#888' }}>Carbs</div>
              <div style={{ color: '#3498db', fontWeight: 'bold' }}>{dietPlan.carbs_grams || '--'}g</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: '#888' }}>Fat</div>
              <div style={{ color: '#f39c12', fontWeight: 'bold' }}>{dietPlan.fat_grams || '--'}g</div>
            </div>
          </div>
          {dietPlan.meals && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: '#FFD700' }}>Meals</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {JSON.parse(dietPlan.meals).map((meal, index) => (
                  <div key={index} style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,215,0,0.1)'
                  }}>
                    <strong style={{ color: '#FFD700' }}>{meal.name}</strong>
                    <span style={{ color: '#888', marginLeft: '0.5rem' }}>{meal.time}</span>
                    <p style={{ color: '#aaa', marginTop: '0.3rem' }}>{meal.foods}</p>
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

export default DietPlan;