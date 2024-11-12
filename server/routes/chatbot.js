const express = require('express');
const { processMessage } = require('../controllers/chatbotController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/message', authMiddleware, processMessage);

module.exports = router;
