const { SNSClient, SubscribeCommand, PublishCommand } = require('@aws-sdk/client-sns');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { saveUser, getUserByEmail, updateUserPreferences } = require('../models/userModel');

// Initialize SNS client
const snsClient = new SNSClient({ region: 'us-east-1' }); // Update your AWS region
const snsTopicArn = 'arn:aws:sns:us-east-1:905418443228:UserNotifications'; // Replace with your SNS Topic ARN

// Subscribe user email to SNS topic
const subscribeUserToSNS = async (email, userId) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error('User not found.');
    }

    if (user.isSubscribed) {
      console.log(`User ${email} is already subscribed to SNS.`);
      return;
    }

    const params = {
      Protocol: 'email',
      Endpoint: email,
      TopicArn: snsTopicArn,
      Attributes: {
        FilterPolicy: JSON.stringify({
          email: [email] // Filter policy to target this specific email
        })
      }
    };


    const data = await snsClient.send(new SubscribeCommand(params));
    console.log(`Subscription request sent for ${email}:`, data);

    // Update user subscription status and store the SubscriptionArn
    await saveUser({ ...user, isSubscribed: true, snsSubscriptionArn: data.SubscriptionArn });
  } catch (error) {
    console.error('Error subscribing user to SNS:', error);
    throw new Error('Failed to subscribe user to notifications.');
  }
};


// Send notification to a specific user using their Subscription ARN
const sendDirectNotification = async (userId, message) => {
  try {
    // Get user details using userId (assuming it includes the snsSubscriptionArn)
    const user = await getUserById(userId);

    if (!user || !user.snsSubscriptionArn) {
      console.log(`No SNS subscription ARN found for user ${userId}`);
      throw new Error('No subscription found for the user.');
    }

    const params = {
      Message: message,
      Subject: 'Notification', // Email subject
      TargetArn: user.snsSubscriptionArn, // Send to the specific user's subscription ARN
    };

    // AWS SNS publish
    const data = await snsClient.send(new PublishCommand(params));
    console.log(`Notification sent to ${user.email}:`, data);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification.');
  }
};


// Send a registration notification
const sendRegistrationNotification = async (email) => {
  const message = `Welcome to our platform, ${email}! We're excited to have you with us.`;
  await sendDirectNotification(email, message);
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
      await subscribeUserToSNS(email, result.userId);
      await sendRegistrationNotification(email);

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
      await sendDirectNotification(user.id, 'Your preferences have been updated.');

      return res.status(200).json({ message: 'Preferences updated successfully.' });
    }

    return res.status(500).json({ error: 'Failed to update preferences.' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
