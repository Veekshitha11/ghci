const axios = require('axios');
const FormData = require('form-data');

// ✅ UPDATE: Pointing to Port 5001 (Your AI Engine)
const ML_API_BASE_URL = process.env.ML_API_URL || 'http://localhost:5001';

/**
 * ML API Client for Saarthi
 * Connects Node.js Backend -> Python AI Engine
 */
class MLApiClient {

  /**
   * FAQ RAG SYSTEM (Your AI Module)
   * Connects to /faq-answer
   */
  static async getFaqAnswer(userQuestion) {
    try {
      console.log(`🤖 Asking AI Engine: "${userQuestion}"...`);
      
      const response = await axios.post(
        `${ML_API_BASE_URL}/faq-answer`, 
        { question: userQuestion }, // ✅ Matches your app.py input
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10s timeout
        }
      );

      return response.data; // Expected: { answer: "..." }
    } catch (error) {
      console.error('❌ ML API - FAQ Error:', error.message);
      // Return null so the controller knows it failed
      return null;
    }
  }

  /**
   * VOICE BIOMETRICS - Enroll a new user
   */
  static async enrollVoice(userId, audioSamples) {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      
      audioSamples.forEach((audioBuffer, index) => {
        formData.append('audio_sample', audioBuffer, `sample_${index}.wav`);
      });

      const response = await axios.post(
        `${ML_API_BASE_URL}/enroll_voice`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('ML API - Enroll Voice Error:', error.message);
      throw new Error('Voice enrollment failed.');
    }
  }

  /**
   * VOICE BIOMETRICS - Verify a user's voice
   */
  static async verifyVoice(userId, audioBuffer) {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('audio_verification', audioBuffer, 'verification.wav');

      const response = await axios.post(
        `${ML_API_BASE_URL}/verify_voice`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 15000
        }
      );

      return response.data;
    } catch (error) {
      console.error('ML API - Verify Voice Error:', error.message);
      throw new Error('Voice verification failed.');
    }
  }

  /**
   * NLP - Predict intent (Future Task 1.1)
   */
  static async predictIntent(query) {
    try {
      const response = await axios.post(
        `${ML_API_BASE_URL}/predict-intent`, // Updated endpoint name
        { text: query },
        { timeout: 10000 }
      );

      return response.data;
    } catch (error) {
      console.error('ML API - Predict Intent Error:', error.message);
      return null;
    }
  }
}

module.exports = MLApiClient;