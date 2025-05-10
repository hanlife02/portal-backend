const casdoorService = require("../services/casdoorService");

// Handle the callback from Casdoor
const handleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    console.log(
      `Processing authorization code from direct callback: ${code.substring(
        0,
        5
      )}...`
    );

    // Use the internal method to get the token
    const response = await handleCallbackInternal(code);

    // Return the token to the client
    return res.json(response);
  } catch (error) {
    console.error("Error in callback handler:", error);
    console.error("Error details:", error.response?.data || "No response data");
    return res.status(500).json({
      error: "Authentication failed",
      message: error.message,
      details: error.response?.data,
    });
  }
};

// Get the current user's information
const getCurrentUser = (req, res) => {
  try {
    // The user is already attached to the request by the auth middleware
    return res.json(req.user);
  } catch (error) {
    console.error("Error getting current user:", error);
    return res.status(500).json({ error: "Failed to get user information" });
  }
};

// Internal method to handle callback - can be used by both direct callback and frontend callback
const handleCallbackInternal = async (code) => {
  if (!code) {
    throw new Error("Authorization code is required");
  }

  console.log(
    `Processing authorization code internally: ${code.substring(0, 5)}...`
  );

  // Get the token from Casdoor
  const response = await casdoorService.getAuthToken(code);

  return {
    access_token: response.access_token,
    token_type: response.token_type,
    expires_in: response.expires_in,
  };
};

module.exports = {
  handleCallback,
  getCurrentUser,
  handleCallbackInternal,
};
