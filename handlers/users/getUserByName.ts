import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { queryItems } from '../../aws/dynamodb/queryItems'
import { returnData } from '../../utils/returnData'
import { APIGatewayEvent } from 'aws-lambda'

export const handler = async (event: APIGatewayEvent) => {
  const TABLE_NAME_USERS = process.env.TABLE_NAME_USERS
  if (!TABLE_NAME_USERS) {
    console.log('No TABLE_NAME_USERS')
    return
  }
  if (!event.queryStringParameters) {
    return returnData(400, 'No body!')
  }
  const queryParams = event.queryStringParameters
  if (!queryParams.userName) {
    return returnData(400, 'No username!')
  }
  console.log('queryParams: ', queryParams)
  const params: QueryCommandInput = {
    IndexName: 'userNameIndex',
    KeyConditionExpression: 'userName = :u',
    ExpressionAttributeValues: {
      ':u': queryParams.userName,
    },
    TableName: TABLE_NAME_USERS,
  }
  const data = await queryItems(params)
  return returnData(200, 'User', JSON.stringify(data))
}
