const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { QueryCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB Client
const client = new DynamoDBClient({ region: 'us-east-1' });

const getMarketTrends = async (region) => {
  const params = {
    TableName: 'MarketTrends', 
    KeyConditionExpression: '#regionID = :region',
    ExpressionAttributeNames: {
      '#regionID': 'RegionID', 
    },
    ExpressionAttributeValues: {
      ':region': region, 
    },
  };

  try {
    const data = await client.send(new QueryCommand(params));
    return data.Items; 
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    throw error;
  }
};

module.exports = { getMarketTrends };
