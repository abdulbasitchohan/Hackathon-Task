import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAIChatResponse } from '../../utils/aiService';
import { supabase } from '../../utils/supabaseClient';

const AIChatbot = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([
    { type: 'bot', text: '👋 Hi! I\'m your AI Fitness Coach powered by Google Gemini. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState({});

  useEffect(() => {
    fetchUserContext();
  }, [user]);

  const fetchUserContext = async () => {
    try {
      // Fetch diet plan
      const { data: dietPlan } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      // Fetch workout plan
      const { data: workoutPlan } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      // Fetch progress
      const { data: progress } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1);

      setUserContext({
        full_name: profile?.full_name,
        goal: profile?.goal,
        fitness_level: profile?.fitness_level,
        dietPlan: dietPlan?.[0],
        workoutPlan: workoutPlan?.[0],
        progress: progress?.[0]
      });
    } catch (error) {
      console.error('Error fetching context:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await getAIChatResponse(input, userContext);
      
      const botMessage = {
        type: 'bot',
        text: result.response
      };
      
      setMessages(prev => [...prev, botMessage]);

      // Save chat to database
      await supabase.from('chat_logs').insert({
        user_id: user.id,
        message: input,
        response: result.response,
        created_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I\'m having trouble connecting. Please try again later. 🤖'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(26,26,46,0.9))',
        padding: '2rem',
        borderRadius: '15px',
        border: '1px solid rgba(255,215,0,0.2)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#FFD700' }}>🤖 AI Fitness Coach</h2>
        <p style={{ color: '#888' }}>Get personalized fitness advice from your AI coach</p>
        <p style={{ color: '#555', fontSize: '0.8rem' }}>🤖 Powered by Google Gemini AI</p>
      </div>

      <div style={{
        background: 'rgba(26,26,46,0.9)',
        borderRadius: '12px',
        border: '1px solid rgba(255,215,0,0.1)',
        overflow: 'hidden',
        height: '500px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Chat Messages */}
        <div style={{
          flex: 1,
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '0.8rem 1.2rem',
              borderRadius: '12px',
              background: msg.type === 'user' ? 'rgba(255,215,0,0.2)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${msg.type === 'user' ? '#FFD700' : '#333'}`
            }}>
              <div style={{
                color: msg.type === 'user' ? '#FFD700' : '#fff',
                fontSize: '1rem',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '0.8rem 1.2rem',
              borderRadius: '12px',
              background: 'rgba(0,0,0,0.3)',
              color: '#888'
            }}>
              🤖 Thinking...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255,215,0,0.1)',
          display: 'flex',
          gap: '1rem'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Ask your fitness coach..."
            style={{
              flex: 1,
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#0a0a0a',
              color: '#fff',
              fontSize: '1rem'
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: loading ? '#444' : 'linear-gradient(135deg, #FFD700, #DAA520)',
              color: loading ? '#888' : '#0a0a0a',
              fontWeight: 'bold',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? '⏳' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;