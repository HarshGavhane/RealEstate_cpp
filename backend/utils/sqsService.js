// src/services/sqsService.js
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: 'us-west-2' });
const queueUrl = 'https://sqs.us-west-2.amazonaws.com/123456789012/preferencesQueue';

export const sendMessageToSQS = async (message) => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
  };

  await sqsClient.send(new SendMessageCommand(params));
};
