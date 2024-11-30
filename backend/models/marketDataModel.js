const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid'); // Install uuid using `npm install uuid`

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

const createMarketTrend = async (regionID, averagePrice, demand) => {
  try {
    const uniqueDate = `${new Date().toISOString()}-${uuidv4()}`; // Unique date with timestamp and UUID

    const params = {
      TableName: 'MarketTrends',
      Item: {
        RegionID: { S: regionID },        // Partition Key
        Date: { S: uniqueDate },          // Sort Key (unique)
        AveragePrice: { N: averagePrice.toString() },
        Demand: { S: demand },
      },
    };

    const command = new PutItemCommand(params);
    const response = await dynamoDBClient.send(command);
    return response;
  } catch (error) {
    console.error('Error inserting data into MarketTrends:', error);
    throw error;
  }
};

module.exports = { createMarketTrend };
