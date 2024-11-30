// awsClient.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { S3Client } = require('@aws-sdk/client-s3');

// Initialize DynamoDB Client
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',  // Set your region here, or use environment variable
});

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',  // Set your region here, or use environment variable
});

module.exports = {
  dynamoDBClient,
  s3Client,
};
