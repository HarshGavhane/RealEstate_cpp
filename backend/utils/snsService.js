// src/services/snsService.js
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({ region: 'us-west-2' });
const topicArn = 'arn:aws:sns:us-west-2:123456789012:PreferencesUpdates';

export const publishToSNS = async (message) => {
  const params = {
    TopicArn: topicArn,
    Message: JSON.stringify(message),
  };

  await snsClient.send(new PublishCommand(params));
};
