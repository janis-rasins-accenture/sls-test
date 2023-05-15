import { APIGatewayEvent } from 'aws-lambda'
import { putItem } from '../../aws/dynamodb/putItem'
import { v4 as uuidv4 } from 'uuid'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { returnData } from '../../utils/returnData'
import { CreateUserInputIF } from '../../types/users-if'
import { userCreateSchema } from './validation/usersValidation'
import { ValidationError } from 'yup'

export const handler = async (event: APIGatewayEvent) => {
  if (!event.body) {
    return returnData(400, 'No body!')
  }
  const user: CreateUserInputIF = JSON.parse(event.body)
  try {
    await userCreateSchema.validate(user)
  } catch (error) {
    if (error instanceof ValidationError) {
      return returnData(400, error.message)
    }
    return returnData(400, 'Something goes wrong', JSON.stringify(error))
  }
  const uuid = uuidv4()
  const params: PutCommandInput = {
    TableName: process.env.TABLE_NAME_USERS,
    Item: {
      userId: uuid,
      firstName: user.firstName,
      isActive: 1,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
    },
  }
  if (user.avatarUrl) {
    params.Item!.avatarUrl = user.avatarUrl
  }
  const result = await putItem(params)
  if (result.success) {
    return returnData(200, 'Success!', JSON.stringify({ userId: uuid }))
  } else {
    return returnData(400, result.error)
  }
}
