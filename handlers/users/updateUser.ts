import { UpdateCommandInput } from "@aws-sdk/lib-dynamodb"
import { returnData } from "../../utils/returnData"
import { updateItem } from "../../aws/dynamodb/updateItem"

interface UserDataIF {
    userId?: { S: string }
	firstName?: {S: string }
	lastName?: { S: string }
	email?: { S: string }
	avatarUrl?: { S: string }
	userName?: { S: string }
	isActive?: { N: number }
}

export const updateUser = async (user: UserDataIF) => {
    const TABLE_NAME_USERS = process.env.TABLE_NAME_USERS
    if (!TABLE_NAME_USERS) {
        console.log('No TABLE_NAME_USERS')
        return
    }
    if (!user.userId || !user.firstName) {
        return returnData(400, 'No user ID or first name!')
    }

    let updateExpression='set'
    let ExpressionAttributeNames={}
    let ExpressionAttributeValues = {}
    for (const property in user) {
        updateExpression += ` #${property} = :${property} ,`
        ExpressionAttributeNames['#'+property] = property 
        ExpressionAttributeValues[':'+property]=user[property]
    }

    const params: UpdateCommandInput = {
        TableName: TABLE_NAME_USERS,
        Key: {
            userId: user.userId,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: ExpressionAttributeNames,
        ExpressionAttributeValues: ExpressionAttributeValues
    }

    return await updateItem(params)
}
