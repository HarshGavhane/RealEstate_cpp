const express = require('express');
const { getGallery } = require('../controller/galleryController');

const router = express.Router();

// Route to get gallery images based on user preferences
router.get('/gallery/:userId', getGallery);

module.exports = router;
