import { UpdateCommandInput, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb'
import { returnData } from '../../utils/returnData'
import { updateItem } from '../../aws/dynamodb/updateItem'
import { DynamoUserIF } from '../../types/users-if'

export const updateUser = async (
  user: DynamoUserIF,
): Promise<
  | {
      statusCode: number
      body: string
    }
  | UpdateCommandOutput
  | undefined
> => {
  const TABLE_NAME_USERS = process.env.TABLE_NAME_USERS
  if (!TABLE_NAME_USERS) {
    console.log('No TABLE_NAME_USERS')
    return
  }
  if (!user.userId || !user.firstName) {
    return returnData(400, 'No user ID or first name!')
  }

  let updateExpression = 'set'
  let ExpressionAttributeNames = {}
  let ExpressionAttributeValues = {}
  for (const property in user) {
    updateExpression += ` #${property} = :${property} ,`
    ExpressionAttributeNames['#' + property] = property
    ExpressionAttributeValues[':' + property] = user[property]
  }

  const params: UpdateCommandInput = {
    TableName: TABLE_NAME_USERS,
    Key: {
      userId: user.userId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
  }

  return await updateItem(params)
}
