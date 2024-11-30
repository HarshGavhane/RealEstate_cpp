// /backend/services/dynamoService.js

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');  // Import DynamoDB Client

// Configure DynamoDB client
const dynamoDbClient = new DynamoDBClient({
  region: 'us-east-1',  // Replace with your region
});

module.exports = dynamoDbClient;
