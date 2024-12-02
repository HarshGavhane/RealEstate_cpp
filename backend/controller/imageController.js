const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');


// Initialize DynamoDB and SNS clients
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
const multer = require('multer');
const s3Client = require('../awsS3Config');
const sqsClient = new SQSClient({ region: 'us-east-1' });  // Initialize SQS client
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const SQS_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/905418443228/user-notifications-queue'; // Replace with your SQS Queue URL
const BUCKET_NAME = 'real-estate-upload-bucket'; // Your S3 bucket name

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload handler
const uploadImage = async (req, res) => {
  const { region } = req.body;

  // Validate region
  if (!region || !['east', 'west', 'north', 'south'].includes(region)) {
    return res.status(400).json({ message: 'Invalid region selected' });
  }

  // Ensure a file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileName = `${Date.now()}_${req.file.originalname}`;
  const folderPath = `images/${region}/${fileName}`;


  // const preferencesParams = {
  //   TableName: "preferences",
  //   FilterExpression: '#regionval = :regionValue',
  //   ExpressionAttributeNames: {
  //     '#regionval': 'region', // Alias for reserved keyword
  //   },
  //   ExpressionAttributeValues: marshall({ ':regionValue': "East" }),
  // };

  // // Log the scan parameters to see if the filter is correct
  // console.log('Scan Parameters:', JSON.stringify(preferencesParams));

  // // Fetch preferences for the region
  // const preferencesData = await dynamoDBClient.send(new ScanCommand(preferencesParams));
  // console.log("sre",preferencesData);
  try {
    // Upload file to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: folderPath,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand); // Upload file to S3

    let regionsqs = "";
    if (region === "east") {
      regionsqs = "East";
    } else if (region === "west") {
      regionsqs = "West";
    } else if (region === "north") {
      regionsqs = "North";
    } else if (region === "south") {
      regionsqs = "South";
    } else {
      regionsqs = "Unknown";
    }

    // Send message to SQS queue to notify Lambda
    const sqsParams = {
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: JSON.stringify({
        region: regionsqs,
        fileName: fileName,
      }),
    };

    const sqsCommand = new SendMessageCommand(sqsParams);
    const result = await sqsClient.send(sqsCommand); // Send SQS message
    console.log("result",result)
    res.status(200).json({
      message: 'File uploaded successfully',
      filePath: folderPath,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error });
  }
};

module.exports = { upload, uploadImage };
