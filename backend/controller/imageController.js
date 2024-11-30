const multer = require('multer');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../awsS3Config');

const BUCKET_NAME = 'real-estate-upload-bucket';

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = async (req, res) => {
  const { region } = req.body;

  if (!region || !['east', 'west', 'north', 'south'].includes(region)) {
    return res.status(400).json({ message: 'Invalid region selected' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileName = `${Date.now()}_${req.file.originalname}`;
  const folderPath = `images/${region}/${fileName}`;

  try {
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: folderPath,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    res.status(200).json({
      message: 'File uploaded successfully',
      filePath: folderPath,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error });
  }
};

module.exports = { upload, uploadImage };
