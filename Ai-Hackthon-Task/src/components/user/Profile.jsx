import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, uploadImage } from '../../utils/supabaseClient';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    age: profile?.age || '',
    gender: profile?.gender || 'male',
    height: profile?.height || '',
    weight: profile?.weight || '',
    goal: profile?.goal || 'maintenance'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select an image file');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      let avatarUrl = profile?.avatar_url || '';
      
      // Upload avatar if changed
      if (avatarFile) {
        setUploading(true);
        try {
          avatarUrl = await uploadImage(avatarFile, 'profile-pictures', user.id);
          setUploading(false);
        } catch (error) {
          setUploading(false);
          setMessage('❌ Failed to upload avatar: ' + error.message);
          setLoading(false);
          return;
        }
      }
      
      // Prepare update data
      const updateData = {
        full_name: formData.full_name,
        age: parseInt(formData.age) || null,
        gender: formData.gender,
        height: parseFloat(formData.height) || null,
        weight: parseFloat(formData.weight) || null,
        goal: formData.goal,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      };

      // Try to update first
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) {
        // If update fails, try insert (profile might not exist)
        if (updateError.code === 'PGRST116' || updateError.message.includes('row-level security')) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              ...updateData,
              role: 'user',
              created_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Insert error:', insertError);
            // Try one more time with different approach
            const { error: finalError } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                email: user.email,
                ...updateData,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (finalError) throw finalError;
          }
        } else {
          throw updateError;
        }
      }
      
      // Update local state
      await updateProfile(updateData);
      
      setMessage('✅ Profile updated successfully!');
      setAvatarFile(null);
      
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Update error:', error);
      setMessage('❌ Failed to update profile: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2 className="form-title">👤 Profile</h2>
      
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

      <form onSubmit={handleSubmit}>
        {/* Avatar Upload */}
        <div className="form-group" style={{ textAlign: 'center' }}>
          <label>📸 Profile Picture</label>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              border: '2px solid #FFD700',
              overflow: 'hidden',
              cursor: 'pointer',
              background: '#0a0a0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FFE44D'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#FFD700'}
            onClick={() => document.getElementById('avatarInput').click()}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <span style={{ fontSize: '3rem', color: '#555' }}>👤</span>
            )}
          </div>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
          <p style={{ color: '#888', fontSize: '0.8rem' }}>
            {uploading ? '⏳ Uploading...' : 'Click to change avatar'}
          </p>
        </div>

        <div className="form-group">
          <label>👤 Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Your full name"
          />
        </div>
        
        <div className="form-group">
          <label>📧 Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          />
        </div>
        
        <div className="form-group">
          <label>🎂 Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Your age"
            min="12"
            max="100"
          />
        </div>
        
        <div className="form-group">
          <label>⚥ Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>📏 Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="e.g., 175"
            step="0.1"
          />
        </div>
        
        <div className="form-group">
          <label>⚖️ Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="e.g., 75"
            step="0.1"
          />
        </div>
        
        <div className="form-group">
          <label>🎯 Fitness Goal</label>
          <select name="goal" value={formData.goal} onChange={handleChange}>
            <option value="weight_loss">Weight Loss</option>
            <option value="weight_gain">Weight Gain</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={loading || uploading}
        >
          {loading || uploading ? '⏳ Saving...' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;