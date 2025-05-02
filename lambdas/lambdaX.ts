import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  try {
    console.log("LambdaX processing S3 event via QueueA");
    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      console.log("Processed S3 object:", message.Records[0].s3.object.key);
    }
    return { statusCode: 200, body: "Processed S3 event" };
  } catch (error: any) {
    console.error("Error:", error);
    throw error;
  }
};