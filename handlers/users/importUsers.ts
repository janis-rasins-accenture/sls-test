import { APIGatewayEvent } from 'aws-lambda'
import { returnData } from '../../utils/returnData'
import { CreateUserInputIF, DynamoUserIF } from '../../types/users-if'
import { ValidationError, number } from 'yup'
import { batchWrite } from '../../aws/dynamodb/batchWriteItems'
import { v4 as uuidv4 } from 'uuid'
import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { invoke } from '../../aws/lambda/invoke'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { putItem } from '../../aws/dynamodb/putItem'

export const handler = async (event: APIGatewayEvent) => {
  if (!event.body) {
    return returnData(400, 'No body!')
  }
  const users: CreateUserInputIF[] = JSON.parse(event.body)
  if (!users.length) {
    return returnData(400, 'No users!')
  }
  const response = await writeUsersBatch(users)
  return returnData(200, JSON.stringify(response))
}

export const writeUsersBatch = async (users: CreateUserInputIF[]) => {
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
      process.env.TABLE_NAME_USERS as string,
    )
    await invoke('usersCreated', { userCount: users.length })
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

export const usersCreated = async (event: any): Promise<void> => {
  const TABLE_NAME_EVENTS = process.env.TABLE_NAME_EVENTS
  if (!TABLE_NAME_EVENTS) {
    console.log('No TABLE_NAME_EVENTS name')
    return
  }
  const userCreateResponse: UsersCreatedInput = JSON.parse(event)
  const uuid = uuidv4()
  const params: PutCommandInput = {
    TableName: TABLE_NAME_EVENTS,
    Item: {
      eventId: uuid,
      usersCount: userCreateResponse.userCount,
    },
  }
  const result = await putItem(params)

  console.log('Lambda invoke result: ', JSON.stringify(result))
}
