const { DynamoDBClient, QueryCommand, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

// DynamoDB Client
const dynamoDBClient = new DynamoDBClient({
  region: "us-east-1", 
});

// Fetch preferences
const fetchPreferences = async (userId, region) => {
  const params = {
    TableName: "preferences",
    KeyConditionExpression: "#userId = :userId AND #region = :region",
    ExpressionAttributeNames: {
      "#userId": "userId", // Alias for userId
      "#region": "region", // Alias for region (reserved keyword)
    },
    ExpressionAttributeValues: {
      ":userId": { N: String(userId) }, 
      ":region": { S: region },
    },
  };

  try {
    const command = new QueryCommand(params);
    const response = await dynamoDBClient.send(command);
    return response.Items.map((item) => ({
      userId: parseInt(item.userId.N, 10),
      region: item.region.S,
      propertyTypes: item.propertyTypes.SS || [],
      budget: item.budget.NS ? item.budget.NS.map(Number) : [],
    }));
  } catch (error) {
    console.error("Error querying preferences:", error.message);
    throw error;
  }
};

// Save preferences
const savePreferences = async ({ userId, region, propertyTypes, budget }) => {
  const params = {
    TableName: "preferences",
    Item: {
      userId: { N: String(userId) },
      region: { S: region },
      propertyTypes: { SS: propertyTypes },
      budget: { NS: budget.map((value) => String(value)) },
    },
  };

  try {
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.error("Error saving preferences:", error.message);
    throw error;
  }
};

// Delete preferences
const removePreferences = async (userId, region) => {
  const params = {
    TableName: "preferences",
    Key: {
      userId: { N: String(userId) },
      region: { S: region },
    },
  };

  try {
    const command = new DeleteItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.error("Error deleting preferences:", error.message);
    throw error;
  }
};

module.exports = { fetchPreferences, savePreferences, removePreferences };
