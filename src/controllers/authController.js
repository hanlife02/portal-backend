const casdoorService = require('../services/casdoorService');

// Handle the callback from Casdoor
const handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }
    
    // Get the token from Casdoor
    const response = await casdoorService.getAuthToken(code);
    
    // Return the token to the client
    return res.json({ 
      access_token: response.access_token,
      token_type: response.token_type,
      expires_in: response.expires_in
    });
  } catch (error) {
    console.error('Error in callback handler:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Get the current user's information
const getCurrentUser = (req, res) => {
  try {
    // The user is already attached to the request by the auth middleware
    return res.json(req.user);
  } catch (error) {
    console.error('Error getting current user:', error);
    return res.status(500).json({ error: 'Failed to get user information' });
  }
};

module.exports = {
  handleCallback,
  getCurrentUser
};
