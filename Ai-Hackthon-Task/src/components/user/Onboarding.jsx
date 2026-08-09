import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadImage, supabase } from '../../utils/supabaseClient';
import { generateDietPlan, generateWorkoutPlan, saveDietPlan, saveWorkoutPlan } from '../../utils/aiService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Onboarding = () => {
    const { user, profile, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState({
        front: null,
        back: null,
        left: null,
        right: null
    });
    const [imagePreviews, setImagePreviews] = useState({
        front: '',
        back: '',
        left: '',
        right: ''
    });
    const [formData, setFormData] = useState({
        goal: profile?.goal || 'maintenance',
        fitness_level: 'beginner',
        workout_type: 'gym',
        days_per_week: 5,
        allergies: '',
        preferences: ''
    });
    const [generating, setGenerating] = useState(false);

    const fileInputs = {
        front: useRef(null),
        back: useRef(null),
        left: useRef(null),
        right: useRef(null)
    };

    const handleImageUpload = (type, file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviews(prev => ({ ...prev, [type]: reader.result }));
        };
        reader.readAsDataURL(file);

        setImages(prev => ({ ...prev, [type]: file }));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadBodyImages = async () => {
        const uploadedUrls = {};
        for (const [type, file] of Object.entries(images)) {
            if (file) {
                try {
                    const url = await uploadImage(file, 'user-images', `${user.id}/body`);
                    uploadedUrls[type] = url;
                } catch (error) {
                    console.error(`Error uploading ${type} image:`, error);
                }
            }
        }
        return uploadedUrls;
    };

    const handleSubmit = async () => {
        setGenerating(true);
        setLoading(true);

        try {
            toast.loading('🚀 Generating your AI plans...', { duration: 2000 });

            // 1. Update profile
            await updateProfile({
                goal: formData.goal,
                fitness_level: formData.fitness_level,
                preferred_workout: formData.workout_type
            });

            // 2. Upload body images
            const imageUrls = await uploadBodyImages();

            // Save to body_images table
            for (const [type, url] of Object.entries(imageUrls)) {
                if (url) {
                    await supabase.from('body_images').insert({
                        user_id: user.id,
                        image_url: url,
                        image_type: type,
                        uploaded_at: new Date().toISOString()
                    });
                }
            }

            // 3. Generate AI Diet Plan
            toast.loading('🍽️ Creating your diet plan...', { duration: 1500 });
            const dietPlan = await generateDietPlan({
                full_name: profile?.full_name,
                age: profile?.age,
                gender: profile?.gender,
                weight: profile?.weight,
                height: profile?.height,
                goal: formData.goal,
                allergies: formData.allergies,
                preferences: formData.preferences
            });

            await saveDietPlan(user.id, dietPlan);

            // 4. Generate AI Workout Plan
            toast.loading('💪 Creating your workout plan...', { duration: 1500 });
            const workoutPlan = await generateWorkoutPlan({
                goal: formData.goal,
                fitness_level: formData.fitness_level,
                workout_type: formData.workout_type,
                days_per_week: formData.days_per_week
            });

            await saveWorkoutPlan(user.id, workoutPlan);

            toast.dismiss();
            toast.success('🎉 Onboarding complete! Your AI plans are ready!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Onboarding error:', error);
            toast.dismiss();
            toast.error('❌ Failed to complete onboarding: ' + error.message);
        } finally {
            setLoading(false);
            setGenerating(false);
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
                <h2 style={{ color: '#FFD700' }}>🚀 AI Onboarding</h2>
                <p style={{ color: '#888' }}>Step {step} of 3 - Let's get to know you better</p>
                <p style={{ color: '#555', fontSize: '0.9rem' }}>
                    🤖 Powered by Google Gemini AI
                </p>
            </div>

            {step === 1 && (
                <div style={{
                    background: 'rgba(26,26,46,0.9)',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,215,0,0.1)'
                }}>
                    <h3 style={{ color: '#FFD700', marginBottom: '1.5rem' }}>📸 Upload Body Images</h3>
                    <p style={{ color: '#888', marginBottom: '1.5rem' }}>
                        Upload 4 images for AI body analysis (Front, Back, Left, Right)
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem'
                    }}>
                        {['front', 'back', 'left', 'right'].map((type) => (
                            <div key={type} style={{
                                border: '2px dashed rgba(255,215,0,0.3)',
                                borderRadius: '10px',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: imagePreviews[type] ? 'rgba(255,215,0,0.05)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                                onClick={() => fileInputs[type].current?.click()}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FFD700'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'}>
                                <input
                                    ref={fileInputs[type]}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(type, e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                                {imagePreviews[type] ? (
                                    <img src={imagePreviews[type]} alt={type} style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px' }} />
                                ) : (
                                    <>
                                        <div style={{ fontSize: '2rem' }}>📸</div>
                                        <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.3rem' }}>{type.charAt(0).toUpperCase() + type.slice(1)} View</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                        onClick={() => setStep(2)}
                    >
                        Next Step →
                    </button>
                </div>
            )}

            {step === 2 && (
                <div style={{
                    background: 'rgba(26,26,46,0.9)',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,215,0,0.1)'
                }}>
                    <h3 style={{ color: '#FFD700', marginBottom: '1.5rem' }}>🎯 Set Your Goals</h3>

                    <div className="form-group">
                        <label>🎯 Fitness Goal</label>
                        <select name="goal" value={formData.goal} onChange={handleChange}>
                            <option value="weight_loss">Weight Loss</option>
                            <option value="weight_gain">Weight Gain</option>
                            <option value="muscle_gain">Muscle Gain</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>💪 Fitness Level</label>
                        <select name="fitness_level" value={formData.fitness_level} onChange={handleChange}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>🏋️ Workout Type</label>
                        <select name="workout_type" value={formData.workout_type} onChange={handleChange}>
                            <option value="home">Home Workout</option>
                            <option value="gym">Gym Workout</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>📅 Days Per Week</label>
                        <select name="days_per_week" value={formData.days_per_week} onChange={handleChange}>
                            <option value="3">3 Days</option>
                            <option value="4">4 Days</option>
                            <option value="5">5 Days</option>
                            <option value="6">6 Days</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>⚠️ Allergies (comma separated)</label>
                        <input
                            type="text"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            placeholder="e.g., Nuts, Dairy, Gluten"
                        />
                    </div>

                    <div className="form-group">
                        <label>🍽️ Dietary Preferences</label>
                        <input
                            type="text"
                            name="preferences"
                            value={formData.preferences}
                            onChange={handleChange}
                            placeholder="e.g., Vegetarian, Keto, Low Carb"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ flex: 1, justifyContent: 'center' }}
                            onClick={() => setStep(1)}
                        >
                            ← Back
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, justifyContent: 'center' }}
                            onClick={() => setStep(3)}
                        >
                            Next Step →
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div style={{
                    background: 'rgba(26,26,46,0.9)',
                    padding: '2rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,215,0,0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
                    <h3 style={{ color: '#FFD700', marginBottom: '0.5rem' }}>Ready to Generate Your AI Plans!</h3>
                    <p style={{ color: '#888', marginBottom: '1rem' }}>
                        We'll use Google Gemini AI to create personalized plans
                    </p>
                    <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        🤖 Powered by Google Gemini AI
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ fontSize: '2rem' }}>📸</div>
                            <div style={{ color: '#2ecc71' }}>✅ Images Uploaded</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ fontSize: '2rem' }}>🎯</div>
                            <div style={{ color: '#2ecc71' }}>✅ Goals Set</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ fontSize: '2rem' }}>🤖</div>
                            <div style={{ color: '#f39c12' }}>{generating ? '⏳ Generating...' : '✅ Ready'}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ flex: 1, justifyContent: 'center' }}
                            onClick={() => setStep(2)}
                            disabled={loading}
                        >
                            ← Back
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, justifyContent: 'center' }}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? '⏳ Generating Plans...' : '🎯 Generate My Plans'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Onboarding;