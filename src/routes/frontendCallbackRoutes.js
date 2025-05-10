const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Handle frontend callback - this route will be called by the frontend after Casdoor redirects to frontend
router.post("/process", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    console.log(
      `Processing frontend callback with code: ${code.substring(0, 5)}...`
    );

    // Use the existing controller to get the token
    const response = await authController.handleCallbackInternal(code);

    // Return the token to the frontend
    return res.json(response);
  } catch (error) {
    console.error("Error in frontend callback handler:", error);
    return res.status(500).json({
      error: "Authentication failed",
      message: error.message,
      details: error.response?.data,
    });
  }
});

// Alternative endpoint that accepts GET requests with query parameters
router.get("/process", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    console.log(
      `Processing frontend GET callback with code: ${code.substring(0, 5)}...`
    );

    // Use the existing controller to get the token
    const response = await authController.handleCallbackInternal(code);

    // Return the token to the frontend
    return res.json(response);
  } catch (error) {
    console.error("Error in frontend callback handler:", error);
    return res.status(500).json({
      error: "Authentication failed",
      message: error.message,
      details: error.response?.data,
    });
  }
});

module.exports = router;
