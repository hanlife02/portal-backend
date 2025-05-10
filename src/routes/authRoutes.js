const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Handle the callback from Casdoor
router.get('/callback', authController.handleCallback);

// Get the current user's information (requires authentication)
router.get('/user', verifyToken, authController.getCurrentUser);

module.exports = router;
