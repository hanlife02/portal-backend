const config = require("../config");
const fs = require("fs").promises;
const path = require("path");

// Path to the services data file
const SERVICES_FILE_PATH = path.resolve(process.cwd(), "data/services.json");

// Default services
const DEFAULT_SERVICES = [
  {
    id: "lobechat",
    name: "LobeChat",
    description: "LobeChat service",
    url: config.services.lobeChat,
    icon: "chat-icon",
  },
  {
    id: "newapi",
    name: "NewAPI",
    description: "NewAPI service",
    url: config.services.newApi,
    icon: "api-icon",
  },
  {
    id: "treehole",
    name: "TreeHole",
    description: "TreeHole 树洞服务",
    url: "https://treehole.example.com",
    icon: "treehole.png",
  },
];

// Ensure the data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.join(__dirname, "../../data");
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
};

// Initialize services file if it doesn't exist
const initializeServicesFile = async () => {
  try {
    await ensureDataDirectory();

    try {
      await fs.access(SERVICES_FILE_PATH);
    } catch (error) {
      // File doesn't exist, create it with default services
      await fs.writeFile(
        SERVICES_FILE_PATH,
        JSON.stringify(DEFAULT_SERVICES, null, 2)
      );
      console.log("Services file created with default services");
    }
  } catch (error) {
    console.error("Error initializing services file:", error);
    throw error;
  }
};

// Get all services
const getAllServices = async () => {
  try {
    await initializeServicesFile();

    const data = await fs.readFile(SERVICES_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error getting services:", error);
    throw error;
  }
};

// Add a new service
const addService = async (service) => {
  try {
    const services = await getAllServices();

    // Check if service with the same ID already exists
    const existingService = services.find((s) => s.id === service.id);
    if (existingService) {
      throw new Error(`Service with ID ${service.id} already exists`);
    }

    // Add the new service
    services.push(service);

    // Save the updated services
    await fs.writeFile(SERVICES_FILE_PATH, JSON.stringify(services, null, 2));

    return service;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};

// Update a service
const updateService = async (id, updatedService) => {
  try {
    const services = await getAllServices();

    // Find the service to update
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Service with ID ${id} not found`);
    }

    // Update the service
    services[index] = { ...services[index], ...updatedService };

    // Save the updated services
    await fs.writeFile(SERVICES_FILE_PATH, JSON.stringify(services, null, 2));

    return services[index];
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

// Delete a service
const deleteService = async (id) => {
  try {
    const services = await getAllServices();

    // Filter out the service to delete
    const updatedServices = services.filter((s) => s.id !== id);

    // Check if any service was removed
    if (updatedServices.length === services.length) {
      throw new Error(`Service with ID ${id} not found`);
    }

    // Save the updated services
    await fs.writeFile(
      SERVICES_FILE_PATH,
      JSON.stringify(updatedServices, null, 2)
    );

    return { id, deleted: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

module.exports = {
  initializeServicesFile,
  getAllServices,
  addService,
  updateService,
  deleteService,
};
