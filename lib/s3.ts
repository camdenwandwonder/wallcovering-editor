import AWS from 'aws-sdk';


const s3 = new AWS.S3({
region: process.env.S3_REGION,
accessKeyId: process.env.S3_ACCESS_KEY_ID,
secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
signatureVersion: 'v4'
});


export async function uploadBuffer({
Bucket,
Key,
Body,
ContentType,
CacheControl = 'public, max-age=31536000, immutable'
}: { Bucket: string; Key: string; Body: Buffer; ContentType: string; CacheControl?: string; }) {
await s3.putObject({ Bucket, Key, Body, ContentType, CacheControl, ACL: 'public-read' }).promise();
return `https://${Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${Key}`;
}
