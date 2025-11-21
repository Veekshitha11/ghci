const MLApiClient = require('../utils/mlApiClient');

/**
 * FAQ Controller
 * Handles chat requests from the Frontend and routes them to the AI Engine.
 */

const askFaq = async (req, res) => {
  try {
    const { queryText } = req.body; // From React frontend

    if (!queryText) {
      return res.status(400).json({
        success: false,
        answer: 'Please provide a question'
      });
    }

    console.log('📩 Incoming Chat Query:', queryText);

    // 1. Call your AI Engine
    const aiResponse = await MLApiClient.getFaqAnswer(queryText);

    if (aiResponse && aiResponse.answer) {
        // 2. Success! Send AI answer back to React
        console.log('✅ AI Answer:', aiResponse.answer);
        return res.json({
            success: true,
            answer: aiResponse.answer
        });
    } else {
        // 3. Fallback if AI is offline or returns no answer
        return res.json({
            success: true, // Keep success true so app doesn't crash
            answer: "I'm sorry, I am currently unable to connect to my knowledge base."
        });
    }

  } catch (error) {
    console.error('🔥 FAQ Controller Error:', error.message);
    
    res.status(500).json({
      success: false,
      answer: 'Something went wrong. Please try again later.'
    });
  }
};

// This function can be expanded later for full intent prediction
const predictFaq = async (req, res) => {
  try {
    const { queryText } = req.body;
    if (!queryText) return res.status(400).json({ success: false, answer: 'No text provided' });

    // For now, we route this through the same FAQ logic
    // Later you can switch this to MLApiClient.predictIntent(queryText)
    const aiResponse = await MLApiClient.getFaqAnswer(queryText);

    res.json({
      success: true,
      answer: aiResponse?.answer || 'Processing...',
      intent: null, // Placeholder for Task 1.1
      entities: []
    });

  } catch (error) {
    console.error('Predict Error:', error.message);
    res.status(500).json({ success: false, answer: 'Error processing request' });
  }
};

module.exports = { askFaq, predictFaq };