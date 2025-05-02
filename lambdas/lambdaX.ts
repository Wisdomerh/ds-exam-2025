import { Handler, SQSEvent } from "aws-lambda";

interface S3Record {
  s3: { 
    object: { key: string };
    bucket: { name: string };
  };
  address?: { country: string };
}

interface S3Event {
  Records: S3Record[];
}

export const handler: Handler = async (event: SQSEvent) => {
  try {
    console.log("LambdaX processing S3 event via QueueA");
    
    if (!event.Records || event.Records.length === 0) {
      console.log("No records found in event");
      return { statusCode: 200, body: "No records to process" };
    }

    for (const record of event.Records) {
      const body = JSON.parse(record.body);
      const s3Event: S3Event = JSON.parse(body.Message);
      
      if (s3Event.Records && s3Event.Records.length > 0) {
        for (const s3Record of s3Event.Records) {
          const bucketName = s3Record.s3.bucket.name;
          const objectKey = s3Record.s3.object.key;
          const country = s3Record.address?.country || "Unknown";
          
          console.log(`Processing S3 object: s3://${bucketName}/${objectKey}`);
          console.log(`Processing ${country} message`);
        }
      } else {
        console.log("No S3 records found in the SNS message");
      }
    }

    return { statusCode: 200, body: "Processed S3 events successfully" };
  } catch (error: any) {
    console.error("Error processing S3 event:", error);
    throw error;
  }
};