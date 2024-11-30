const express = require("express");
const {
  getPreferences,
  createOrUpdatePreferences,
  deletePreferences,
} = require("../controller/preferencesController");

const router = express.Router();

// Routes
router.get("/fetch", getPreferences); // Fetch preferences
router.post("/create", createOrUpdatePreferences); // Create or update preferences
router.delete("/delete", deletePreferences); // Delete preferences

module.exports = router;
