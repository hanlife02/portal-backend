const portalService = require('../services/portalService');

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await portalService.getAllServices();
    return res.json(services);
  } catch (error) {
    console.error('Error getting services:', error);
    return res.status(500).json({ error: 'Failed to get services' });
  }
};

// Add a new service
const addService = async (req, res) => {
  try {
    const { id, name, description, url, icon } = req.body;
    
    // Validate required fields
    if (!id || !name || !url) {
      return res.status(400).json({ error: 'ID, name, and URL are required' });
    }
    
    // Create the service object
    const service = {
      id,
      name,
      description: description || '',
      url,
      icon: icon || 'default-icon',
    };
    
    // Add the service
    const newService = await portalService.addService(service);
    
    return res.status(201).json(newService);
  } catch (error) {
    console.error('Error adding service:', error);
    
    // Check if it's a duplicate service error
    if (error.message && error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Failed to add service' });
  }
};

// Update a service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, url, icon } = req.body;
    
    // Create the update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (url) updateData.url = url;
    if (icon) updateData.icon = icon;
    
    // Update the service
    const updatedService = await portalService.updateService(id, updateData);
    
    return res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    
    // Check if it's a not found error
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Failed to update service' });
  }
};

// Delete a service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the service
    const result = await portalService.deleteService(id);
    
    return res.json(result);
  } catch (error) {
    console.error('Error deleting service:', error);
    
    // Check if it's a not found error
    if (error.message && error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Failed to delete service' });
  }
};

module.exports = {
  getAllServices,
  addService,
  updateService,
  deleteService
};
