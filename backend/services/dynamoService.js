// /backend/services/dynamoService.js

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');  

// Configure DynamoDB client
const dynamoDbClient = new DynamoDBClient({
  region: 'us-east-1',  
});

module.exports = dynamoDbClient;
