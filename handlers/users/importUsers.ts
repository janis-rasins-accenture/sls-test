import { APIGatewayEvent } from 'aws-lambda'
import { returnData } from '../../utils/returnData'
import { CreateUserInputIF, DynamoUserIF } from '../../types/users-if'
import { userCreateSchema } from './validation/usersValidation'
import { ValidationError } from 'yup'
import { batchWrite } from '../../aws/dynamodb/batchWriteItems'
import { v4 as uuidv4 } from 'uuid'
import { AttributeValue } from '@aws-sdk/client-dynamodb'

export const handler = async (event: APIGatewayEvent) => {
  if (!event.body) {
    return returnData(400, 'No body!')
  }
  const users: CreateUserInputIF[] = JSON.parse(event.body)
  if (!users.length) {
    return returnData(400, 'No users!')
  }
  try {
    let parsedUsers: DynamoUserIF[] = []
    for (const user of users) {
      await userCreateSchema.validate(user)
      parsedUsers.push({
        avatarUrl: { S: user.avatarUrl as string },
        email: { S: user.email as string },
        firstName: { S: user.firstName as string },
        isActive: { N: 1 },
        userId: { S: uuidv4() },
        lastName: { S: user.lastName as string },
        userName: { S: user.userName as string },
      })
    }
    const response = await batchWrite(
      parsedUsers as Record<string, AttributeValue>[],
      process.env.TABLE_NAME_USERS as string,
    )
    return returnData(200, response.message)
  } catch (error) {
    if (error instanceof ValidationError) {
      return returnData(400, error.message)
    }
    return returnData(400, 'Something goes wrong', JSON.stringify(error))
  }
}
