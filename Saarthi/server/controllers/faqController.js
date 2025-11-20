const axios = require('axios');

/**
 * FAQ Controller
 * Proxies requests to the external FAQ Python server
 * CRITICAL: Translates queryText → query for Python API
 */

const FAQ_API_URL = process.env.FAQ_API_URL || 'http://localhost:5000';

const askFaq = async (req, res) => {
  try {
    const { queryText } = req.body; // From React frontend

    if (!queryText) {
      return res.status(400).json({
        success: false,
        answer: 'Please provide a question'
      });
    }

    console.log('FAQ Query:', queryText);

    // CRITICAL TRANSLATION: queryText → query
    const response = await axios.post(`${FAQ_API_URL}/ask`, {
      query: queryText // Python server expects "query", not "queryText"
    }, {
      timeout: 10000 // 10 second timeout
    });

    console.log('FAQ Response:', response.data);

    // Send answer back to React
    res.json({
      success: true,
      answer: response.data.answer || 'No answer available'
    });

  } catch (error) {
    console.error('Error calling FAQ server:', error.message);
    
    // Friendly error message
    res.status(500).json({
      success: false,
      answer: 'Saarthi is thinking... please try again.'
    });
  }
};

const predictFaq = async (req, res) => {
  try {
    const { queryText } = req.body;

    if (!queryText) {
      return res.status(400).json({
        success: false,
        answer: 'Please provide a question'
      });
    }

    console.log('FAQ Predict Query:', queryText);

    const response = await axios.post(`${FAQ_API_URL}/ask`, { query: queryText }, { timeout: 15000 });

    res.json({
      success: true,
      answer: response.data?.answer || 'Saarthi is thinking... please try again.',
      intent: response.data?.intent ?? null,
      entities: response.data?.entities ?? []
    });
  } catch (error) {
    console.error('FAQ Predict error:', error.message);
    res.status(error?.response?.status || 500).json({
      success: false,
      answer: 'Saarthi is thinking... please try again.'
    });
  }
};

module.exports = { askFaq, predictFaq };
