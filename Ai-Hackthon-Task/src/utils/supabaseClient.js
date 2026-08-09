import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const STORAGE_BUCKETS = {
  USER_IMAGES: 'user-images',
  PROGRESS_IMAGES: 'progress-images',
  PROFILE_PICTURES: 'profile-pictures'
};

export const ADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@fitnesscoach.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@123'
};

// Gemini API Key
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Upload Image
export const uploadImage = async (file, bucket = 'profile-pictures', folder = '') => {
  try {
    if (!file) throw new Error('No file provided');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Delete Image
export const deleteImage = async (url, bucket) => {
  try {
    if (!url) return true;
    const path = url.split('/').pop();
    if (!path) return true;
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};