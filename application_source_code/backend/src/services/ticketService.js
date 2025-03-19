import pkg from "aws-sdk";
const { DynamoDB } = pkg;
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const dynamoDb = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const TABLE_NAME = "cloudmart-tickets";

export const createTicket = async (ticket) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...ticket,
      id: uuidv4().split("-")[0],
      createdAt: new Date().toISOString(),
    },
  };

  await dynamoDb.put(params).promise();
  return params.Item;
};

export const getAllTickets = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const result = await dynamoDb.scan(params).promise();
  return result.Items;
};

export const getTicketById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  const result = await dynamoDb.get(params).promise();
  return result.Item;
};

export const updateTicket = async (id, updates) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set #status = :status, conversation = :conversation, sentimentScores = :sentimentScores, overallSentiment = :overallSentiment",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": updates.status,
      ":conversation": updates.conversation,
      ":sentimentScores": updates.sentimentScores,
      ":overallSentiment": updates.overallSentiment,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDb.update(params).promise();
  return result.Attributes;
};

export const deleteTicket = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  await dynamoDb.delete(params).promise();
};

export const getTicketsByStatus = async (status) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "#status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": status,
    },
  };

  const result = await dynamoDb.scan(params).promise();
  return result.Items;
};
