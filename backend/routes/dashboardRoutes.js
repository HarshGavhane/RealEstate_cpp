const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');

// Route for fetching market trends based on region
router.get('/', dashboardController.getMarketTrends);

module.exports = router;
