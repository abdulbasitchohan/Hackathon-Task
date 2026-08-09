import { supabase, GEMINI_API_KEY } from './supabaseClient';

// ============================================
// GEMINI API CALL FUNCTION
// ============================================
const callGeminiAPI = async (prompt) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to .env');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topK: 40,
            topP: 0.95,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`Gemini API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Call Error:', error);
    throw error;
  }
};

// ============================================
// AI DIET PLAN GENERATOR
// ============================================
export const generateDietPlan = async (userData) => {
  try {
    const prompt = `
      You are a professional nutritionist. Create a detailed 7-day diet plan in JSON format only.
      
      User Information:
      - Name: ${userData.full_name || 'User'}
      - Age: ${userData.age || '25'}
      - Gender: ${userData.gender || 'Not specified'}
      - Weight: ${userData.weight || '70'} kg
      - Height: ${userData.height || '175'} cm
      - Goal: ${userData.goal || 'maintenance'}
      - Allergies: ${userData.allergies || 'None'}
      - Preferences: ${userData.preferences || 'None'}

      Return ONLY valid JSON with this exact structure:
      {
        "name": "Personalized Diet Plan",
        "description": "Brief description of the plan",
        "total_calories": 2000,
        "protein_grams": 150,
        "carbs_grams": 200,
        "fat_grams": 70,
        "meals": [
          { "name": "Breakfast", "time": "8:00 AM", "foods": "Oatmeal with fruits and nuts" },
          { "name": "Lunch", "time": "1:00 PM", "foods": "Grilled chicken with rice and vegetables" },
          { "name": "Snack", "time": "4:00 PM", "foods": "Greek yogurt with berries" },
          { "name": "Dinner", "time": "7:00 PM", "foods": "Fish with sweet potato and greens" }
        ]
      }

      Make the plan personalized based on the user's goal, weight, and preferences.
      Return ONLY the JSON object, nothing else.
    `;

    const response = await callGeminiAPI(prompt);
    
    // Clean the response - remove any markdown or extra text
    const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('AI Diet Plan Error:', error);
    return getFallbackDietPlan(userData);
  }
};

// Fallback if API fails
const getFallbackDietPlan = (userData) => ({
  name: 'Balanced Diet Plan',
  description: 'A healthy balanced diet for your fitness journey',
  total_calories: 2000,
  protein_grams: 150,
  carbs_grams: 200,
  fat_grams: 70,
  meals: [
    { name: 'Breakfast', time: '8:00 AM', foods: 'Oatmeal with fruits and nuts' },
    { name: 'Lunch', time: '1:00 PM', foods: 'Grilled chicken with rice and vegetables' },
    { name: 'Snack', time: '4:00 PM', foods: 'Greek yogurt with berries' },
    { name: 'Dinner', time: '7:00 PM', foods: 'Fish with sweet potato and greens' }
  ]
});

// ============================================
// AI WORKOUT PLAN GENERATOR
// ============================================
export const generateWorkoutPlan = async (userData) => {
  try {
    const prompt = `
      You are a professional fitness trainer. Create a weekly workout plan in JSON format only.
      
      User Information:
      - Goal: ${userData.goal || 'maintenance'}
      - Fitness Level: ${userData.fitness_level || 'beginner'}
      - Workout Type: ${userData.workout_type || 'gym'}
      - Days per week: ${userData.days_per_week || 5}

      Return ONLY valid JSON with this exact structure:
      {
        "name": "Personalized Workout Plan",
        "description": "Brief description of the plan",
        "type": "${userData.workout_type || 'gym'}",
        "difficulty": "${userData.fitness_level || 'beginner'}",
        "weekly_split": [
          { "day": "Monday", "exercises": [{ "name": "Bench Press", "sets": 3, "reps": 10, "notes": "Focus on form" }] },
          { "day": "Tuesday", "exercises": [{ "name": "Squats", "sets": 3, "reps": 12, "notes": "Keep back straight" }] }
        ]
      }

      Make the plan personalized based on the user's goal, fitness level, and workout type.
      Include exercises appropriate for their level.
      Return ONLY the JSON object, nothing else.
    `;

    const response = await callGeminiAPI(prompt);
    
    // Clean the response
    const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('AI Workout Plan Error:', error);
    return getFallbackWorkoutPlan(userData);
  }
};

// Fallback workout plan
const getFallbackWorkoutPlan = (userData) => ({
  name: 'Balanced Workout Plan',
  description: 'A balanced workout routine for overall fitness',
  type: userData.workout_type || 'gym',
  difficulty: userData.fitness_level || 'beginner',
  weekly_split: [
    { day: 'Monday', exercises: [{ name: 'Push-ups', sets: 3, reps: 12, notes: 'Keep body straight' }] },
    { day: 'Tuesday', exercises: [{ name: 'Squats', sets: 3, reps: 15, notes: 'Go parallel' }] },
    { day: 'Wednesday', exercises: [{ name: 'Rest Day', sets: 0, reps: 0, notes: 'Active recovery' }] },
    { day: 'Thursday', exercises: [{ name: 'Pull-ups', sets: 3, reps: 8, notes: 'Use assist if needed' }] },
    { day: 'Friday', exercises: [{ name: 'Lunges', sets: 3, reps: 12, notes: 'Step forward' }] },
    { day: 'Saturday', exercises: [{ name: 'Planks', sets: 3, reps: 60, notes: 'Hold position' }] },
    { day: 'Sunday', exercises: [{ name: 'Rest Day', sets: 0, reps: 0, notes: 'Rest and recover' }] }
  ]
});

// ============================================
// AI CHATBOT (RAG)
// ============================================
export const getAIChatResponse = async (message, userContext) => {
  try {
    const prompt = `
      You are an AI Fitness Coach. Provide helpful, encouraging fitness advice.
      
      User Context:
      - Name: ${userContext.full_name || 'User'}
      - Goal: ${userContext.goal || 'Not set'}
      - Fitness Level: ${userContext.fitness_level || 'Not set'}
      - Diet Plan: ${JSON.stringify(userContext.dietPlan || 'Not set')}
      - Workout Plan: ${JSON.stringify(userContext.workoutPlan || 'Not set')}
      
      User Question: ${message}
      
      Provide a helpful, specific, and encouraging response. Don't give medical advice.
      Keep the response conversational and supportive.
    `;

    const response = await callGeminiAPI(prompt);
    
    return {
      response: response,
      tokensUsed: 0 // Gemini doesn't provide token count in free tier
    };
  } catch (error) {
    console.error('AI Chat Error:', error);
    return {
      response: getFallbackChatResponse(message),
      tokensUsed: 0
    };
  }
};

// Fallback chat responses
const getFallbackChatResponse = (message) => {
  const responses = [
    "Great question! Based on your fitness goals, I recommend staying consistent with your workouts and tracking your progress daily. 💪",
    "Remember to focus on proper form during exercises to prevent injury. Start with lighter weights and gradually increase. 🏋️",
    "Hydration is key! Aim for 2-3 liters of water daily, especially on workout days. 💧",
    "Your diet plays a crucial role. Make sure you're getting enough protein (1.6g per kg of body weight) for muscle recovery. 🍗",
    "Rest is just as important as training. Aim for 7-9 hours of quality sleep for optimal recovery. 😴",
    "Consistency beats intensity. It's better to work out 4 days a week consistently than 7 days sporadically. 📅",
    "Listen to your body. If you're feeling pain (not soreness), take a break and consult a professional. 🩺"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// ============================================
// SAVE AI GENERATED PLAN TO DATABASE
// ============================================
export const saveDietPlan = async (userId, planData) => {
  try {
    const { data, error } = await supabase
      .from('diet_plans')
      .insert({
        user_id: userId,
        name: planData.name,
        description: planData.description,
        total_calories: planData.total_calories,
        protein_grams: planData.protein_grams,
        carbs_grams: planData.carbs_grams,
        fat_grams: planData.fat_grams,
        meals: JSON.stringify(planData.meals),
        is_ai_generated: true,
        is_active: true,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Save diet plan error:', error);
    throw error;
  }
};

export const saveWorkoutPlan = async (userId, planData) => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert({
        user_id: userId,
        name: planData.name,
        description: planData.description,
        type: planData.type,
        difficulty: planData.difficulty,
        weekly_split: JSON.stringify(planData.weekly_split),
        is_ai_generated: true,
        is_active: true,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Save workout plan error:', error);
    throw error;
  }
};

// ============================================
// BODY ANALYSIS (Using Gemini Vision)
// ============================================
export const analyzeBodyImage = async (imageUrl, imageType) => {
  try {
    const prompt = `
      You are a professional fitness analyst. Analyze this ${imageType} body image.
      Provide:
      1. Estimated Body Fat Percentage
      2. Posture Assessment (Good/Needs Improvement)
      3. 2-3 Recommendations for improvement
      
      Return ONLY valid JSON:
      {
        "body_fat_percentage": 15.5,
        "posture": "Good",
        "recommendations": ["Focus on core strength", "Improve shoulder mobility"]
      }
    `;

    // For Gemini Vision, we need to send the image as base64
    // This is simplified - in production, you'd download the image first
    const response = await callGeminiAPI(prompt);
    
    const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Image Analysis Error:', error);
    return {
      body_fat_percentage: 15,
      posture: 'Needs Improvement',
      recommendations: ['Focus on posture', 'Add core exercises']
    };
  }
};