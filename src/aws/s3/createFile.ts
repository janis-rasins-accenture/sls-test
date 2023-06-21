import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3'
import { s3Client } from './libs/S3client'

interface S3CreateResponseIF {
  isSuccess: boolean
  message: string
}

export const createFile = async (params: PutObjectCommandInput): Promise<S3CreateResponseIF> => {
  try {
    const response = await s3Client.send(new PutObjectCommand(params))
    return { isSuccess: true, message: `S3 response: ${JSON.stringify(response)}` }
  } catch (error) {
    return { isSuccess: true, message: `S3 response: ${JSON.stringify(error)}` }
  }
}
