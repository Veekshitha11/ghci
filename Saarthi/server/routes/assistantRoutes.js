const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');
const auth = require('../middleware/auth');

/**
 * Voice Assistant Routes
 */

// POST /api/assistant/ask - Main Q&A endpoint for voice assistant
router.post('/ask', assistantController.ask);

// POST /api/faq/ask - FAQ Q&A endpoint
router.post('/ask', assistantController.faqAsk);

// GET /api/assistant/history - Get chat history
router.get('/history', auth, assistantController.getHistory);

module.exports = router;