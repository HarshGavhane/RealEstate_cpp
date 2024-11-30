const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controller/imageController');

// Upload Route
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
