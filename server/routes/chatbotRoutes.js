const express = require('express');
const router = express.Router();
const { processMessage } = require('../controllers/chatbotController');

/**
 * Route to handle incoming chatbot messages.
 * @route POST /message
 */
router.post('/message', processMessage);

module.exports = router;