require('dotenv').config(); // Load .env variables
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

// Configure the DynamoDB client
const ddbClient = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token,
  },
});

module.exports = ddbClient;
