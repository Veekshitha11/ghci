
const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');

// Define the POST route
// Endpoint will be: http://localhost:5000/api/bot/ask
router.post('/ask', botController.getBotResponse);

module.exports = router;