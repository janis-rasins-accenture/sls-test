import { APIGatewayEvent } from 'aws-lambda'
import { returnData } from '../../utils/returnData'

export const handler = async (event: APIGatewayEvent) => {
    return returnData(200, 'Go Serverless v3.0! Your function executed successfully!', JSON.stringify(event))
}