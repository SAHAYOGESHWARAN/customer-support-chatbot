const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(400).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};


module.exports = authMiddleware;