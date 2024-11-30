
// models/s3Model.js
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { s3Client } = require('../awsClient');

// Fetch images from S3 based on region
const getImagesByRegion = async (region) => {
  const bucketName = 'real-estate-upload-bucket';  // S3 bucket name
  const prefix = `images/${region}/`;  // Folder structure in S3 (images/region/)

  const params = {
    Bucket: bucketName,
    Prefix: prefix,
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);
    
    // Return the image URLs from S3
    const imageUrls = data.Contents.map((file) => {
      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`;
    });

    return imageUrls;
  } catch (err) {
    console.error('Error fetching images from S3:', err);
    throw new Error('Error fetching images from S3');
  }
};

module.exports = {
  getImagesByRegion,
};
