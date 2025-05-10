const casdoorService = require('../services/casdoorService');

// Middleware to verify if the user is authenticated
const verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  // Extract the token
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the token and get the user
    const user = casdoorService.parseJwtToken(token);
    
    // Add the user to the request object
    req.user = user;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = {
  verifyToken
};
