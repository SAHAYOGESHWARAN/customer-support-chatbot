const express = require('express');
const { processMessage } = require('../controllers/chatbotController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/message', 
  authMiddleware, 
  async (req, res, next) => {
    try {
      const result = await processMessage(req, res);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;