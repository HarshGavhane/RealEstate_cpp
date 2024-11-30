// controllers/fileController.js
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const fs = require('fs');

// Configure Multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

// AWS S3 Client Setup
const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload Image Function
const uploadImage = async (req, res) => {
  const { region } = req.body;
  const file = req.file;

  if (!file || !region) {
    return res.status(400).send({ message: 'Region and image file are required' });
  }

  try {
    const fileBuffer = fs.readFileSync(file.path);
    const s3Key = `images/${region}/${file.originalname}`;

    const uploadParams = {
      Bucket: 'real-estate-upload-bucket',
      Key: s3Key,
      Body: fileBuffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    fs.unlinkSync(file.path); // Remove the local file

    res.status(200).send({ message: 'Image uploaded successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to upload image', error });
  }
};

module.exports = { upload, uploadImage };
