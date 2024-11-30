// models/dynamoDBModel.js
const { DynamoDBClient, PutItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE_NAME = "ImageMetadata";

// Save Image Metadata
const saveImageMetadata = async (image) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: { S: image.id },
      title: { S: image.title },
      description: { S: image.description },
      uploadedAt: { S: image.uploadedAt },
    },
  };

  try {
    await dynamoDB.send(new PutItemCommand(params));
  } catch (error) {
    console.error('Error saving metadata to DynamoDB:', error);
    throw new Error('DynamoDB save failed');
  }
};

// List Image Metadata
const listImageMetadata = async () => {
  const params = { TableName: TABLE_NAME };

  try {
    const data = await dynamoDB.send(new ScanCommand(params));
    return data.Items.map((item) => ({
      id: item.id.S,
      title: item.title.S,
      description: item.description.S,
      uploadedAt: item.uploadedAt.S,
    }));
  } catch (error) {
    console.error('Error fetching metadata from DynamoDB:', error);
    throw new Error('DynamoDB fetch failed');
  }
};

module.exports = { saveImageMetadata, listImageMetadata };
