import { APIGatewayEvent } from 'aws-lambda'
import { returnData } from '../../utils/returnData'
import { PutObjectCommandInput } from '@aws-sdk/client-s3'
import { createFile } from '../../aws/s3/createFile'

export const handler = async (event: APIGatewayEvent) => {
  const BUCKET_NAME = process.env.BUCKET_NAME
  if (!BUCKET_NAME) {
    return returnData(400, 'missing bucket name')
  }
  if (!event.pathParameters || !event.pathParameters.fileName || !event.body) {
    return returnData(400, 'missing the fileName from the path or missing body')
  }

  let fileName = event.pathParameters.fileName
  console.log('Received file name: ', fileName)

  const params: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: event.body,
  }

  try {
    const response = await createFile(params)
    if (response.isSuccess) {
      return returnData(200, `Received and saved file: ${fileName}`)
    } else {
      return returnData(400, `Error save file to bucket ${BUCKET_NAME}: ${response.message}`)
    }
  } catch (error) {
    return returnData(400, `Something goes wrong error: ${JSON.stringify(error)}`)
  }
}
