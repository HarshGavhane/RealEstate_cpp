// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controller/fileUploadController'); // Ensure the path is correct

// POST route for uploading image
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
