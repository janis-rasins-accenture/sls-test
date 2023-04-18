import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3'
import { S3Event } from 'aws-lambda'
import { s3Client } from '../../aws/s3/libs/S3client'
import { streamToObject } from '../../aws/s3/libs/utils'
import { CreateUserInputIF } from '../../types/users-if'
import { writeUsersBatch } from '../users/importUsers'

export const handler = async (event: S3Event): Promise<void> => {
  console.log('S3 new file: ', event.Records[0].s3.object.key)
  const fileName = event.Records[0].s3.object.key
  const fileExt = fileName.split('.').pop()?.toLowerCase()
  if (fileExt !== 'json') {
    console.log('File is not JSON')
    return
  }
  const params: GetObjectCommandInput = {
    Bucket: event.Records[0].s3.bucket.name,
    Key: fileName,
  }

  try {
    const { Body } = await s3Client.send(new GetObjectCommand(params))
    const users = (await streamToObject(Body as NodeJS.ReadableStream)) as unknown
    const writeResponse = await writeUsersBatch(users as CreateUserInputIF[])
    console.log('Batch users write response: ', JSON.stringify(writeResponse))
  } catch (error) {
    console.log('File read error: ', JSON.stringify(error))
  }
}
