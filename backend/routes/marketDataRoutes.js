const express = require('express');
const { addMarketTrend } = require('../controller/marketDataUploadController');
const router = express.Router();

router.post('/create', addMarketTrend);

module.exports = router;
