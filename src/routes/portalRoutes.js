const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portalController');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all services (public route)
router.get('/services', portalController.getAllServices);

// Protected routes (require authentication)
// Add a new service
router.post('/services', verifyToken, portalController.addService);

// Update a service
router.put('/services/:id', verifyToken, portalController.updateService);

// Delete a service
router.delete('/services/:id', verifyToken, portalController.deleteService);

module.exports = router;
