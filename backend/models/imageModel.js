const { ListObjectsV2Command, HeadObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../awsS3Config'); // Import AWS S3 client

const getImages = async () => {
  const params = {
    Bucket: 'real-estate-upload-bucket', // Your S3 bucket name
    Prefix: 'images/', // Folder in your S3 bucket
  };

  try {
    // List objects in the specified folder
    const listCommand = new ListObjectsV2Command(params);
    const data = await s3.send(listCommand);

    if (!data.Contents || data.Contents.length === 0) {
      throw new Error('No images found');
    }

    console.log('Fetched keys:', data.Contents.map(item => item.Key));

    // Fetch metadata for each image
    const images = await Promise.all(data.Contents.map(async (item) => {
      try {
        const headCommand = new HeadObjectCommand({
          Bucket: params.Bucket,
          Key: item.Key,
        });
        const metadata = await s3.send(headCommand);

        console.log(`Metadata for ${item.Key}:`, metadata.Metadata);

        // Extract metadata with fallback to defaults
        const title = metadata.Metadata?.title || 'Untitled';
        const description = metadata.Metadata?.description || 'No description available';

        return {
          title,
          description,
          url: `https://${params.Bucket}.s3.amazonaws.com/${item.Key}`,
          key: item.Key,
        };
      } catch (err) {
        console.error(`Error fetching metadata for ${item.Key}:`, err);
        return null; // Handle failure for specific keys
      }
    }));

    // Filter out null results from failed metadata fetches
    return images.filter(image => image !== null);

  } catch (error) {
    console.error('Error fetching images or metadata:', error);
    throw new Error('Error fetching images or metadata');
  }
};

module.exports = { getImages };
