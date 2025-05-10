require('dotenv').config();
const cert = require('./cert');

const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  casdoor: {
    endpoint: process.env.CASDOOR_ENDPOINT,
    clientId: process.env.CASDOOR_CLIENT_ID,
    clientSecret: process.env.CASDOOR_CLIENT_SECRET,
    certificate: cert,
    orgName: process.env.CASDOOR_ORG_NAME,
    appName: process.env.CASDOOR_APP_NAME,
  },
  callbackUrl: process.env.CALLBACK_URL,
  services: {
    lobeChat: process.env.LOBE_CHAT_URL,
    newApi: process.env.NEWAPI_URL,
  }
};

module.exports = config;
