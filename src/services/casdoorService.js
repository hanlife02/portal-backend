const { SDK } = require("casdoor-nodejs-sdk");
const config = require("../config");

// Initialize Casdoor SDK
const casdoorConfig = {
  endpoint: config.casdoor.endpoint,
  clientId: config.casdoor.clientId,
  clientSecret: config.casdoor.clientSecret,
  certificate: config.casdoor.certificate,
  orgName: config.casdoor.orgName,
  appName: config.casdoor.appName,
};

const sdk = new SDK(casdoorConfig);

module.exports = {
  sdk,

  // Get auth token from code
  getAuthToken: async (code) => {
    try {
      console.log(
        `Attempting to get auth token with code: ${code.substring(0, 5)}...`
      );
      console.log(
        `Using Casdoor config: endpoint=${casdoorConfig.endpoint}, clientId=${casdoorConfig.clientId}, orgName=${casdoorConfig.orgName}`
      );

      const response = await sdk.getAuthToken(code);

      console.log("Successfully obtained auth token");
      return response;
    } catch (error) {
      console.error("Error getting auth token:", error);
      console.error(
        "Error details:",
        error.response?.data || "No response data"
      );
      throw error;
    }
  },

  // Parse JWT token to get user info
  parseJwtToken: (token) => {
    try {
      const user = sdk.parseJwtToken(token);
      return user;
    } catch (error) {
      console.error("Error parsing JWT token:", error);
      throw error;
    }
  },

  // Get user information
  getUsers: async () => {
    try {
      const { data: users } = await sdk.getUsers();
      return users;
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  },

  // Get a specific user
  getUser: async (username) => {
    try {
      const { data: user } = await sdk.getUser(username);
      return user;
    } catch (error) {
      console.error(`Error getting user ${username}:`, error);
      throw error;
    }
  },
};
