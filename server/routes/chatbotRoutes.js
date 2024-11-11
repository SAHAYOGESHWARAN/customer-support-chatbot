const express = require('express');
const router = express.Router();
const { processMessage } = require('../controllers/chatbotController');

router.post('/message', processMessage);

module.exports = router;
