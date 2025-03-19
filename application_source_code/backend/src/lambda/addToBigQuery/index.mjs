import { BigQuery } from "@google-cloud/bigquery";
import { DynamoDBStreamsClient } from "@aws-sdk/client-dynamodb-streams";
import { unmarshall } from "@aws-sdk/util-dynamodb";

// Initialize BigQuery client using the credentials file
const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Initialize DynamoDB Streams client
const dynamodbStreamsClient = new DynamoDBStreamsClient({
  region: process.env.AWS_REGION,
});

// BigQuery dataset and table details from environment variables
const datasetId = process.env.BIGQUERY_DATASET_ID;
const tableId = process.env.BIGQUERY_TABLE_ID;

// Helper function to ensure a number is fixed to 2 decimal places
const toFixed2 = (num) => {
  return Number(parseFloat(num).toFixed(2));
};

export const handler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    for (const record of event.Records) {
      if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
        const newImage = unmarshall(record.dynamodb.NewImage);
        console.log(
          "Unmarshalled DynamoDB record:",
          JSON.stringify(newImage, null, 2)
        );

        // Prepare the row for BigQuery
        const row = {
          id: newImage.id,
          createdAt: newImage.createdAt,
          items: JSON.stringify(newImage.items), // Convert DynamoDB List to JSON string
          status: newImage.status,
          total: toFixed2(newImage.total), // Ensure total is a float with 2 decimal places
          userEmail: newImage.userEmail,
        };

        console.log("Prepared row for BigQuery:", JSON.stringify(row, null, 2));

        try {
          // Insert the row into BigQuery
          const [apiResponse] = await bigquery
            .dataset(datasetId)
            .table(tableId)
            .insert([row]);

          console.log(
            `Inserted row with ID ${row.id} into BigQuery. API Response:`,
            JSON.stringify(apiResponse, null, 2)
          );
        } catch (insertError) {
          console.error(
            `Error inserting row with ID ${row.id} into BigQuery:`,
            insertError
          );
          if (insertError.errors && insertError.errors.length > 0) {
            console.error(
              "Detailed insert errors:",
              JSON.stringify(insertError.errors, null, 2)
            );
          }
        }
      }
    }

    return { statusCode: 200, body: "Data processed successfully" };
  } catch (error) {
    console.error("Error processing DynamoDB stream:", error);
    return { statusCode: 500, body: "Error processing data" };
  }
};
