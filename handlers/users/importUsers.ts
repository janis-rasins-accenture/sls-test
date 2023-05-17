import { APIGatewayEvent } from 'aws-lambda'
import { returnData } from '../../utils/returnData'
import { CreateUserInputIF, DynamoUserIF } from '../../types/users-if'
import { ValidationError } from 'yup'
import { BatchWriteResponseIF, batchWrite } from '../../aws/dynamodb/batchWriteItems'
import { v4 as uuidv4 } from 'uuid'
import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { invoke } from '../../aws/lambda/invoke'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { putItem } from '../../aws/dynamodb/putItem'

export const handler = async (event: APIGatewayEvent) => {
  const LAMBDA_NAME_USERS_CREATED = process.env.LAMBDA_NAME_USERS_CREATED
  if (!LAMBDA_NAME_USERS_CREATED) {
    return returnData(400, 'No lambda function name')
  }
  if (!event.body) {
    return returnData(400, 'No body!')
  }
  const users: CreateUserInputIF[] = JSON.parse(event.body)
  if (!users.length) {
    return returnData(400, 'No users!')
  }
  const response = await writeUsersBatch(users)
  if (typeof response === 'object' && response.isSuccess) {
    await invoke(LAMBDA_NAME_USERS_CREATED, { userCount: users.length })
  }
  return returnData(200, JSON.stringify(response))
}

export const writeUsersBatch = async (
  users: CreateUserInputIF[],
): Promise<BatchWriteResponseIF | string> => {
  const TABLE_NAME_USERS = process.env.TABLE_NAME_USERS
  if (!TABLE_NAME_USERS) {
    console.log('No users table name!')
    return 'No users table name!'
  }
  try {
    const parsedUsers: DynamoUserIF[] = users.map((user) => {
      return {
        avatarUrl: { S: user.avatarUrl as string },
        email: { S: user.email as string },
        firstName: { S: user.firstName as string },
        isActive: { N: 1 },
        userId: { S: uuidv4() },
        lastName: { S: user.lastName as string },
        userName: { S: user.userName as string },
      }
    })
    const result = await batchWrite(
      parsedUsers as Record<string, AttributeValue>[],
      TABLE_NAME_USERS,
    )
    return result
  } catch (error) {
    if (error instanceof ValidationError) {
      return error.message
    }
    return `Something goes wrong: ${JSON.stringify(error)}`
  }
}

interface UsersCreatedInput {
  userCount: number
}

export const usersCreated = async (payload: UsersCreatedInput): Promise<void> => {
  const TABLE_NAME_EVENTS = process.env.TABLE_NAME_EVENTS
  if (!TABLE_NAME_EVENTS) {
    console.log('No TABLE_NAME_EVENTS name')
    return
  }
  if (!payload.userCount) {
    console.log('No user count!')
    return
  }
  const uuid = uuidv4()
  const params: PutCommandInput = {
    TableName: TABLE_NAME_EVENTS,
    Item: {
      eventId: uuid,
      usersCount: payload.userCount,
    },
  }
  const result = await putItem(params)
  console.log('Lambda invoke result: ', JSON.stringify(result))
}
