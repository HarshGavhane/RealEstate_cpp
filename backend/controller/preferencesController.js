const { fetchPreferences, savePreferences, removePreferences } = require("../models/preferencesModel");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

// Initialize the SNS client
const snsClient = new SNSClient({ region: "us-east-1" }); // Update with your region
const topicArn = "arn:aws:sns:us-east-1:905418443228:UserNotifications"; // Replace with your SNS Topic ARN

// Function to send SNS notification
const sendSNSNotification = async (message) => {
  try {
    const params = {
      Message: message,
      TopicArn: topicArn, // Your SNS topic ARN
    };

    const command = new PublishCommand(params);
    await snsClient.send(command);
    console.log("Notification sent successfully.");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// Get preferences for a user and region
const getPreferences = async (req, res) => {
  const { userId, region } = req.query;

  if (!userId || !region) {
    return res.status(400).json({ error: "userId and region are required." });
  }

  try {
    const preferences = await fetchPreferences(userId, region);

    if (!preferences || preferences.length === 0) {
      return res.status(200).json({ message: "No preferences set yet." });
    }

    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error fetching preferences:", error.message);
    res.status(500).json({ error: "Failed to fetch preferences." });
  }
};

// Create or update preferences
const createOrUpdatePreferences = async (req, res) => {
  const { userId, region, propertyTypes, budget } = req.body;

  if (!userId || !region || !propertyTypes || !budget) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Fetch existing preferences to compare
    const existingPreferences = await fetchPreferences(userId, region);

    // Save the new preferences (create or update)
    await savePreferences({ userId, region, propertyTypes, budget });

    // Prepare the SNS message
    let message = `Preferences for user ${userId} in region ${region} have been saved/updated.`;
    if (existingPreferences.length > 0) {
      const updatedFields = [];

      // Check for changes and add them to the message
      if (existingPreferences[0].propertyTypes.toString() !== propertyTypes.toString()) {
        updatedFields.push(`Property Types: ${propertyTypes.join(", ")}`);
      }
      if (existingPreferences[0].budget.toString() !== budget.toString()) {
        updatedFields.push(`Budget: ${budget.join(", ")}`);
      }

      if (updatedFields.length > 0) {
        message += ` Updated fields: ${updatedFields.join(", ")}.`;
      }
    }

    // Send SNS notification with the updated values
    await sendSNSNotification(message);

    res.status(201).json({ message: "Preferences saved successfully." });
  } catch (error) {
    console.error("Error saving preferences:", error.message);
    res.status(500).json({ error: "Failed to save preferences." });
  }
};

// Delete preferences
const deletePreferences = async (req, res) => {
  const { userId, region } = req.query;

  if (!userId || !region) {
    return res.status(400).json({ error: "userId and region are required." });
  }

  try {
    // Fetch existing preferences to include in the deletion message
    const existingPreferences = await fetchPreferences(userId, region);

    // Delete preferences
    await removePreferences(userId, region);

    // Prepare the SNS message for deletion
    let message = `Preferences for user ${userId} in region ${region} have been deleted.`;
    if (existingPreferences.length > 0) {
      message += ` Deleted fields: Property Types: ${existingPreferences[0].propertyTypes.join(", ")}, Budget: ${existingPreferences[0].budget.join(", ")}`;
    }

    // Send SNS notification with the deleted values
    await sendSNSNotification(message);

    res.status(200).json({ message: "Preferences deleted successfully." });
  } catch (error) {
    console.error("Error deleting preferences:", error.message);
    res.status(500).json({ error: "Failed to delete preferences." });
  }
};

module.exports = { getPreferences, createOrUpdatePreferences, deletePreferences };
