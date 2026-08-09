import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  RiRunLine,
  RiRestaurantLine,
  RiChatAiLine,
  RiCalendarLine,
  RiBarChartLine,
  RiHeartPulseLine,
  RiShieldStarLine,
  RiArrowRightLine,
  RiRocketLine,
  RiUserHeartLine,
  RiTrophyLine,
  RiMedalLine
} from '@remixicon/react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '0' }}>
      {/* Hero Section - Premium */}
      <section style={{
        position: 'relative',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        borderRadius: '24px',
        marginBottom: '3rem',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at top, rgba(245,166,35,0.08), transparent 60%), radial-gradient(ellipse at bottom, rgba(74,158,255,0.04), transparent 50%), #0A0A0F',
        border: '1px solid rgba(255,255,255,0.04)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Animated background orbs */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(245,166,35,0.06), transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(74,158,255,0.04), transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '880px'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.2rem',
            background: 'rgba(245,166,35,0.12)',
            border: '1px solid rgba(245,166,35,0.2)',
            borderRadius: '50px',
            color: '#F5A623',
            fontSize: '0.8rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            letterSpacing: '0.5px'
          }}>
            <span style={{ fontSize: '1rem' }}>🚀</span>
            AI-Powered Fitness Coach
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
            fontWeight: 900,
            marginBottom: '0.5rem',
            color: '#FFFFFF',
            lineHeight: 1.1,
            letterSpacing: '-1.5px'
          }}>
            Transform Your{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #F5A623, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Fitness
            </span>{' '}
            Journey
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            fontWeight: 300,
            letterSpacing: '-0.3px'
          }}>
            with Personalized AI Diet & Workout Plans
          </p>
          
          <p style={{
            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            color: 'var(--text-muted)',
            maxWidth: '640px',
            margin: '0 auto 2rem',
            lineHeight: 1.8
          }}>
            Get customized meal plans, workout routines, and real-time AI coaching 
            tailored to your goals and body type. Powered by Google Gemini AI.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard <RiArrowRightLine size={20} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free <RiRocketLine size={20} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '2.5rem',
            flexWrap: 'wrap'
          }}>
            {['🤖 Powered by Gemini AI', '⚡ 100+ Active Users', '🏆 95% Satisfaction'].map((item, i) => (
              <span key={i} style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Premium */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.5px'
          }}>
            Everything You <span style={{ color: '#F5A623' }}>Need</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            AI-powered tools to achieve your fitness goals
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { 
              icon: <RiRunLine size={28} />, 
              title: 'Workout Plans', 
              desc: 'Personalized home/gym workout routines with sets, reps, and weekly splits',
              gradient: 'linear-gradient(135deg, rgba(74,158,255,0.1), rgba(74,158,255,0.02))',
              color: '#4A9EFF'
            },
            { 
              icon: <RiRestaurantLine size={28} />, 
              title: 'Diet Plans', 
              desc: 'Custom meal plans with calories, macros, and allergy-aware options',
              gradient: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(52,211,153,0.02))',
              color: '#34D399'
            },
            { 
              icon: <RiChatAiLine size={28} />, 
              title: 'AI Chatbot', 
              desc: 'Get real-time fitness advice from your personal AI coach powered by Gemini',
              gradient: 'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(167,139,250,0.02))',
              color: '#A78BFA'
            },
            { 
              icon: <RiCalendarLine size={28} />, 
              title: 'Habit Tracker', 
              desc: 'Track meals, water, workouts, sleep, and maintain your streak',
              gradient: 'linear-gradient(135deg, rgba(245,166,35,0.1), rgba(245,166,35,0.02))',
              color: '#F5A623'
            },
            { 
              icon: <RiBarChartLine size={28} />, 
              title: 'Progress Tracking', 
              desc: 'Monitor weight, body fat, and muscle growth with AI insights',
              gradient: 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,107,107,0.02))',
              color: '#FF6B6B'
            },
            { 
              icon: <RiHeartPulseLine size={28} />, 
              title: 'Body Analysis', 
              desc: 'AI-powered body analysis with posture detection and BMI estimation',
              gradient: 'linear-gradient(135deg, rgba(245,166,35,0.1), rgba(245,166,35,0.02))',
              color: '#FF6B6B'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: feature.gradient,
              padding: '2rem',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.04)',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = feature.color + '40';
              e.currentTarget.style.boxShadow = `0 12px 40px ${feature.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `radial-gradient(circle, ${feature.color}20, transparent 60%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: feature.color,
                fontSize: '1.5rem'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - Premium */}
      <section style={{
        background: 'var(--bg-card)',
        padding: '3rem',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.04)',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.5px'
          }}>
            How It <span style={{ color: '#F5A623' }}>Works</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Get started in 4 simple steps
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem'
        }}>
          {[
            { step: '01', title: 'Sign Up', desc: 'Create your account and tell us about yourself', icon: '📝' },
            { step: '02', title: 'Body Analysis', desc: 'Upload images for AI body analysis', icon: '📸' },
            { step: '03', title: 'Get Plans', desc: 'Receive personalized diet and workout plans', icon: '🤖' },
            { step: '04', title: 'Track & Improve', desc: 'Track habits and get AI coaching daily', icon: '📈' }
          ].map((item, index) => (
            <div key={index} style={{
              textAlign: 'center',
              position: 'relative',
              padding: '1.5rem'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '0.5rem'
              }}>
                {item.icon}
              </div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--gold-primary)',
                letterSpacing: '2px',
                marginBottom: '0.3rem'
              }}>
                STEP {item.step}
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.3rem', fontWeight: 600 }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(10,10,15,0.95))',
        padding: '3.5rem',
        borderRadius: '20px',
        border: '1px solid rgba(245,166,35,0.15)',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '0.5rem'
        }}>
          🚀
        </div>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '0.5rem'
        }}>
          Ready to Transform Your Fitness?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
          Join thousands of users achieving their fitness goals with AI coaching
        </p>
        {user ? (
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard <RiArrowRightLine size={20} />
          </Link>
        ) : (
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Your Journey <RiRocketLine size={20} />
          </Link>
        )}
      </section>
    </div>
  );
};

export default Home;