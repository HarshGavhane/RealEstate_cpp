const express = require("express");
const { fetchUserChoices } = require("../controller/profileController");

const router = express.Router();

// Route to fetch user preferences
router.get("/profile/:userId", fetchUserChoices);

module.exports = router;
