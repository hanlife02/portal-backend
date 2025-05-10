const { SDK } = require('casdoor-nodejs-sdk');
const config = require('../config');

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
      const response = await sdk.getAuthToken(code);
      return response;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  },
  
  // Parse JWT token to get user info
  parseJwtToken: (token) => {
    try {
      const user = sdk.parseJwtToken(token);
      return user;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      throw error;
    }
  },
  
  // Get user information
  getUsers: async () => {
    try {
      const { data: users } = await sdk.getUsers();
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
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
  }
};
