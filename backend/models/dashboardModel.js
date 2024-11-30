const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB Client
const client = new DynamoDBClient({ region: 'us-east-1' });

const getMarketTrends = async (region) => {
  const params = {
    TableName: 'MarketTrends', // Replace with your actual table name
    KeyConditionExpression: '#regionID = :region',
    ExpressionAttributeNames: {
      '#regionID': 'RegionID', // The partition key
    },
    ExpressionAttributeValues: {
      ':region': region, // Directly pass the region string
    },
  };

  try {
    const data = await client.send(new QueryCommand(params));
    return data.Items; // Return the fetched items
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    throw error;
  }
};

module.exports = { getMarketTrends };
