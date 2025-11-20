const axios = require('axios');
const FormData = require('form-data');

// ML API Base URL - Update this to match your ML server IP
const ML_API_BASE_URL = process.env.ML_API_URL || 'http://localhost:5000';

/**
 * ML API Client for Voice Biometrics and NLP
 * This module communicates with the Saarthi AI/ML Flask service
 */

class MLApiClient {
  /**
   * VOICE BIOMETRICS - Enroll a new user
   * @param {string} userId - Unique user identifier
   * @param {Array<Buffer>} audioSamples - Array of 3-5 audio file buffers
   * @returns {Promise<Object>} Enrollment result
   */
  static async enrollVoice(userId, audioSamples) {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      
      // Append each audio sample
      audioSamples.forEach((audioBuffer, index) => {
        formData.append('audio_sample', audioBuffer, `sample_${index}.wav`);
      });

      const response = await axios.post(
        `${ML_API_BASE_URL}/enroll_voice`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000 // 30 second timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('ML API - Enroll Voice Error:', error.message);
      throw new Error('Voice enrollment failed. Please try again.');
    }
  }

  /**
   * VOICE BIOMETRICS - Verify a user's voice
   * @param {string} userId - Unique user identifier
   * @param {Buffer} audioBuffer - Single audio file buffer for verification
   * @returns {Promise<Object>} Verification result with authenticated status
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
          timeout: 15000 // 15 second timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('ML API - Verify Voice Error:', error.message);
      throw new Error('Voice verification failed. Please try again.');
    }
  }

  /**
   * NLP - Predict intent and extract entities from text query
   * @param {string} query - User's text query
   * @returns {Promise<Object>} Intent and entities
   */
  static async predictIntent(query) {
    try {
      const response = await axios.post(
        `${ML_API_BASE_URL}/predict`,
        { query },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 second timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('ML API - Predict Intent Error:', error.message);
      throw new Error('Intent prediction failed. Please try again.');
    }
  }
}

module.exports = MLApiClient;