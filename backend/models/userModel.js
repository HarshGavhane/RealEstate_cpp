const { PutItemCommand, QueryCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb'); // Add GetItemCommand here
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const ddbClient = require('../config');

// Function to save user in DynamoDB
const saveUser = async (data) => {
  try {
    const numericId = Math.floor(Math.random() * 1000000); // Numeric ID generation
    const userWithId = { ...data, id: numericId }; // Add numeric ID

    // Remove undefined values to avoid marshall errors
    const params = {
      TableName: 'users',
      Item: marshall(userWithId, { removeUndefinedValues: true }), // Marshall the user data to fit DynamoDB format
    };

    console.log('DynamoDB parameters:', params); // Debug log to verify parameters
    const command = new PutItemCommand(params);
    await ddbClient.send(command); 
    console.log('User saved successfully'); 

    return { success: true, id: numericId }; // Return success with generated ID
  } catch (error) {
    console.error('Error saving user to DynamoDB:', error.message); // Log specific error message
    throw new Error('Error saving user to DynamoDB');
  }
};

// Function to get user by email from DynamoDB
const getUserByEmail = async (email) => {
  try {
    // Query parameters should match the key schema in DynamoDB
    const params = {
      TableName: 'users',
      IndexName: 'email-index', // Assuming there is a secondary index on email
      KeyConditionExpression: 'email = :email', // Query by email
      ExpressionAttributeValues: marshall({ ':email': email }), // Use marshall for attributes
    };

    console.log('Querying DynamoDB with params:', params); // Debug log to verify parameters
    const command = new QueryCommand(params);
    const data = await ddbClient.send(command); // Query DynamoDB for the user

    if (!data.Items || data.Items.length === 0) {
      console.log('User not found');
      return null; // User not found
    }

    // Unmarshall the data and return the user object
    const user = unmarshall(data.Items[0]);
    console.log('User fetched successfully:', user); // Debug log for fetched user
    return user;
  } catch (error) {
    console.error('Error fetching user from DynamoDB:', error.message); // Log specific error message
    throw new Error('Error fetching user from DynamoDB');
  }
};

// Function to get user by ID from DynamoDB
const getUserById = async (id) => {
  try {
    // Prepare the parameters for the GetItemCommand
    const params = {
      TableName: 'users', // Your DynamoDB table name
      Key: marshall({ id }), // Use marshall to convert the ID into the appropriate format
    };

    console.log('Querying DynamoDB with params:', params); // Debug log to verify parameters

    // Create the GetItemCommand
    const command = new GetItemCommand(params); // Correctly reference GetItemCommand
    
    // Execute the command to fetch the item
    const data = await ddbClient.send(command); 

    // Check if data.Items exists and return the user
    if (!data.Item) {
      console.log('User not found');
      return null; // If the item is not found, return null
    }

    // Unmarshall the data to convert it back into a JavaScript object
    const user = unmarshall(data.Item);
    console.log('User fetched successfully:', user); // Debug log for fetched user
    return user; // Return the unmarshalled user object
  } catch (error) {
    console.error('Error fetching user from DynamoDB:', error.message); // Log specific error message
    throw new Error('Error fetching user from DynamoDB');
  }
};

module.exports = { saveUser, getUserByEmail, getUserById };
