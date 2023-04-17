import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  forcePathStyle: true,
  credentials: {
    accessKeyId: 'S3RVER', // This specific key is required when working offline
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:4569',
})
