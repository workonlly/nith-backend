// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required. Please provide Authorization header.' 
    });
  }

  // Handle both "Bearer <token>" and raw token formats
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication token missing.' 
    });
  }

  const secret = process.env.JWT_SECRET || 'nith_secret_key_2026';

  jwt.verify(token, secret, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid, malformed, or expired token.' 
      });
    }

    // Attach decoded faculty user info (id, status, tag, email, etc.)
    req.user = decodedUser;
    next();
  });
};

// Middleware to verify specific status/tag permissions if required
const requireStatus = (...allowedStatuses) => {
  return (req, res, next) => {
    if (!req.user || !allowedStatuses.includes(req.user.status)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires status: ${allowedStatuses.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { authenticateToken, requireStatus };
