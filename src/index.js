const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const authRoutes = require("./routes/authRoutes");
const portalRoutes = require("./routes/portalRoutes");
const frontendCallbackRoutes = require("./routes/frontendCallbackRoutes");
const portalService = require("./services/portalService");

// Initialize the Express application
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
// Configure CORS to allow requests from frontend domains
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8654"], // Add your frontend domains here
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies if needed
  })
);
app.use(express.json()); // Parse JSON request bodies

// Initialize services data
portalService.initializeServicesFile().catch((error) => {
  console.error("Failed to initialize services data:", error);
  process.exit(1);
});

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/portal", portalRoutes);
app.use("/api/frontend-auth", frontendCallbackRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Portal Backend API",
    version: "1.0.0",
    status: "running",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: config.server.env === "development" ? err.message : undefined,
  });
});

// Start the server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.server.env}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

module.exports = app;
