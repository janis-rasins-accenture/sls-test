import { APIGatewayEvent } from 'aws-lambda'
import { StandardResponse, returnData } from '../../../src/utils/returnData'

export const handler = async (event: APIGatewayEvent): Promise<StandardResponse> => {
  return returnData(
    200,
    'Go Serverless v3.0! Your function executed successfully!',
    JSON.stringify(event),
  )
}
