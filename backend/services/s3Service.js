const { S3Client, ListObjectsCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({ region: process.env.AWS_REGION });

const getImagesFromS3 = async (region) => {
  const folderPath = `images/${region}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: folderPath, // List objects in the folder
  };

  try {
    const command = new ListObjectsCommand(params);
    const data = await client.send(command);
    if (data.Contents) {
      return data.Contents.map((item) => ({
        key: item.Key,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
      }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching images from S3:', err);
    throw err;
  }
};

module.exports = { getImagesFromS3 };
