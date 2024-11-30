const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });

/**
 * Fetch user preferences from the DynamoDB table
 * @param {number} userId - The user's ID
 * @returns {Array} - Array of user preference objects
 */
const getUserChoices = async (userId) => {
    try {
      const params = {
        TableName: "preferences",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": { N: userId.toString() },
        },
      };
  
      const command = new QueryCommand(params);
      const data = await client.send(command);
  
      if (!data.Items || data.Items.length === 0) {
        return []; // No preferences found
      }
  
      // Log the raw DynamoDB response to debug
      console.log("Raw DynamoDB data:", JSON.stringify(data, null, 2));
  
      const userChoices = data.Items.map((item) => {
        const region = item.region?.S || "Unknown";
        
        // Handle propertyTypes (SS = String Set)
        const propertyTypes = item.propertyTypes?.SS || [];
        
        // Handle budget (NS = Number Set)
        const budgetRange = item.budget?.NS ? item.budget.NS.map(b => Number(b)) : [];
        
        // Log the parsed budgetRange for debugging
        console.log(`Parsed budgetRange for region ${region}:`, budgetRange);

        return {
          region,
          budgetRange,
          propertyTypes,
        };
      });
  
      return userChoices;
    } catch (error) {
      console.error("Error fetching user preferences:", error.message);
      throw new Error("Could not fetch user preferences.");
    }
  };

module.exports = { getUserChoices };
