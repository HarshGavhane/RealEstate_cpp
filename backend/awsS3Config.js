// awsS3Config.js
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.aws_access_key_id,
      secretAccessKey: process.env.aws_secret_access_key,
      sessionToken: process.env.aws_session_token,
    },
});

module.exports = s3;
