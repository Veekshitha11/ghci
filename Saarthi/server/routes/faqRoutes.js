// ========== server/routes/faqRoutes.js (NEW FILE) ==========
const express = require('express');
const router = express.Router();
const { askFaq, predictFaq } = require('../controllers/faqController');

/**
 * FAQ Routes
 * Routes for FAQ functionality
 */

// POST /api/faq/ask - Ask a question to FAQ server
router.post('/ask', askFaq);
router.post('/predict', predictFaq);

module.exports = router;