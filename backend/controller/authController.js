const { SNSClient, SubscribeCommand, PublishCommand } = require('@aws-sdk/client-sns');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { saveUser, getUserByEmail, updateUserPreferences } = require('../models/userModel');

// Initialize SNS client
const snsClient = new SNSClient({ region: 'us-east-1' }); // Update your AWS region
const snsTopicArns = {
  userNotifications: 'arn:aws:sns:us-east-1:905418443228:UserNotifications', // Replace with your SNS Topic ARN for user notifications
  imageUploadNotifications: 'arn:aws:sns:us-east-1:905418443228:ImageUploadNotifications', // Replace with your SNS Topic ARN for image upload notifications
};

// Subscribe user email to SNS topics
const subscribeUserToSNS = async (email, userId) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error('User not found.');
    }

    // Check if user is already subscribed to both topics
    if (user.isSubscribed) {
      console.log(`User ${email} is already subscribed to SNS.`);
      return;
    }

    // Subscribe user to userNotifications topic
    const userParams = {
      Protocol: 'email',
      Endpoint: email,
      TopicArn: snsTopicArns.userNotifications,
      Attributes: {
        FilterPolicy: JSON.stringify({
          email: [email] // Filter policy to target this specific email
        })
      }
    };
    const userSubscription = await snsClient.send(new SubscribeCommand(userParams));
    console.log(`Subscription request sent for ${email} to userNotifications:`, userSubscription);

    // Subscribe user to imageUploadNotifications topic
    const imageUploadParams = {
      Protocol: 'email',
      Endpoint: email,
      TopicArn: snsTopicArns.imageUploadNotifications,
      Attributes: {
        FilterPolicy: JSON.stringify({
          email: [email] // Filter policy to target this specific email
        })
      }
    };
    const imageUploadSubscription = await snsClient.send(new SubscribeCommand(imageUploadParams));
    console.log(`Subscription request sent for ${email} to imageUploadNotifications:`, imageUploadSubscription);

    // Update user subscription status and store the SubscriptionArn for both topics
    await saveUser({ ...user, isSubscribed: true, snsSubscriptionArnUserNotifications: userSubscription.SubscriptionArn, snsSubscriptionArnImageUploadNotifications: imageUploadSubscription.SubscriptionArn });
  } catch (error) {
    console.error('Error subscribing user to SNS:', error);
    throw new Error('Failed to subscribe user to notifications.');
  }
};

// Send notification to a specific user using their Subscription ARN
const sendDirectNotification = async (userId, message, topic) => {
  try {
    const user = await getUserById(userId);

    if (!user || !(topic === 'userNotifications' ? user.snsSubscriptionArnUserNotifications : user.snsSubscriptionArnImageUploadNotifications)) {
      console.log(`No SNS subscription ARN found for user ${userId} on topic ${topic}`);
      throw new Error('No subscription found for the user.');
    }

    const params = {
      Message: message,
      Subject: 'Notification', // Email subject
      TargetArn: topic === 'userNotifications' ? user.snsSubscriptionArnUserNotifications : user.snsSubscriptionArnImageUploadNotifications, // Send to the specific user's subscription ARN
    };

    // AWS SNS publish
    const data = await snsClient.send(new PublishCommand(params));
    console.log(`Notification sent to ${user.email} on topic ${topic}:`, data);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification.');
  }
};

// Send a registration notification
const sendRegistrationNotification = async (email) => {
  const message = `Welcome to our platform, ${email}! We're excited to have you with us.`;
  await sendDirectNotification(email, message, 'userNotifications');
};

// Send an image upload notification
const sendImageUploadNotification = async (userId) => {
  const message = `Your image has been successfully uploaded!`;
  await sendDirectNotification(userId, message, 'imageUploadNotifications');
};

// Register user
exports.registerUser = async (req, res) => {
  const { username, email, password, isAdmin = false } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields (username, email, password) are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await saveUser({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });

    if (result.success) {
      await subscribeUserToSNS(email, result.userId); // Subscribe to both topics

      return res.status(201).json({ message: 'User registered successfully.' });
    }

    return res.status(500).json({ error: 'Failed to save user.' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required.' });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

// Update user preferences and notify the user
exports.updatePreferences = async (req, res) => {
  const { userId, email } = req.user; // The authenticated user's ID and email
  const { preferences } = req.body;

  if (!preferences) {
    return res.status(400).json({ error: 'Preferences data is required.' });
  }

  try {
    // Log the user's email before proceeding
    console.log(`Logged-in user email: ${email}`);

    // Update user preferences in the database
    const result = await updateUserPreferences(userId, preferences);

    if (result.success) {
      const user = await getUserByEmail(email); // Get the user details using the authenticated user's email

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Send notification only to the user making the changes (the one whose preferences are being updated)
      await sendDirectNotification(user.id, 'Your preferences have been updated.', 'userNotifications');

      return res.status(200).json({ message: 'Preferences updated successfully.' });
    }

    return res.status(500).json({ error: 'Failed to update preferences.' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
