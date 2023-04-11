import { APIGatewayEvent } from 'aws-lambda'
import { putItem } from '../../aws/dynamodb/putItem'
import { v4 as uuidv4 } from 'uuid'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { returnData } from '../../utils/returnData'

interface CreateUserInputIF {
    firstName?: string
    lastName?: string
    email?: string
}

export const handler = async (event: APIGatewayEvent) => {
    if (!event.body) {
        return returnData(400, "No body!")
    }
    const body: CreateUserInputIF = JSON.parse(event.body)
    if (!body.firstName || !body.email || !body.lastName) {
        console.log('body: ', body)
        return returnData(400, "No mandatory data!")
    }
    const uuid = uuidv4()
    const params: PutCommandInput = {
        TableName: process.env.TABLE_NAME_USERS,
        Item: {
            userId: uuid,
            firstName: body.firstName,
            isActive: 1,
            lastName: body.lastName,
            email: body.email,
        }
    }
    const result = await putItem(params)
    if (result.success) {
        return returnData(200, "Success!", JSON.stringify({ userId: uuid }))
    } else {
        return returnData(400, "No firstName!")
    }
}