const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize AWS SDK clients
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const s3Client = new S3Client({ region: 'us-east-1' });

// DynamoDB table name
const PREFERENCES_TABLE = 'preferences';
const S3_BUCKET_NAME = 'real-estate-upload-bucket';

// Image folders in S3 (case sensitive to region name)
const IMAGE_FOLDERS = ['east', 'west', 'south', 'north'];

async function getUserPreferences(userId) {
  try {
    const params = {
      TableName: PREFERENCES_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { N: userId.toString() },
      },
    };

    const command = new QueryCommand(params);
    const data = await dynamoDbClient.send(command);
    
    // Fetch preferences for the user
    return data.Items.map(item => ({
      region: item.region.S.toLowerCase(), // Convert region to lowercase for consistency
      budget: item.budget.S,
      propertyTypes: item.propertyTypes.S,
    }));
  } catch (error) {
    console.error("Error fetching preferences from DynamoDB:", error);
    throw new Error('Error fetching preferences');
  }
}

async function getImagesForRegions(regions) {
  try {
    let images = [];

    // Fetch images for each selected region (case insensitive check)
    for (const region of regions) {
      // Ensure lowercase region comparison with IMAGE_FOLDERS
      if (IMAGE_FOLDERS.includes(region.toLowerCase())) { 
        const params = {
          Bucket: S3_BUCKET_NAME,
          Prefix: `images/${region.toLowerCase()}/`, 
        };

        const command = new ListObjectsV2Command(params);
        const data = await s3Client.send(command);

        // Generate presigned URLs for each image
        for (const item of data.Contents) {
          const objectParams = {
            Bucket: S3_BUCKET_NAME,
            Key: item.Key,
          };
          const url = await getSignedUrl(s3Client, new GetObjectCommand(objectParams), { expiresIn: 3600 }); // URL valid for 1 hour
          images.push(url); // Add presigned URL to the list
        }
      }
    }

    return images;
  } catch (error) {
    console.error("Error fetching images from S3:", error);
    throw new Error('Error fetching images');
  }
}

module.exports = { getUserPreferences, getImagesForRegions };
