import { APIGatewayEvent } from 'aws-lambda'
import { putItem } from '../../aws/dynamodb/putItem'
import { v4 as uuidv4 } from 'uuid'
import { PutCommandInput } from '@aws-sdk/lib-dynamodb'

interface CreateUserInputIF {
    firstName?: string
}

export const handler = async (event: APIGatewayEvent) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify(
                {
                    message: "No body!",
                },
                null,
                2
            ),
        }
    }
    const body: CreateUserInputIF = JSON.parse(event.body)
    if (!body.firstName) {
        console.log('body: ', body)
        return {
            statusCode: 400,
            body: JSON.stringify(
                {
                    message: "No firstName!",
                },
                null,
                2
            ),
        }
    }
    const uuid = uuidv4()
    const params: PutCommandInput = {
        TableName: process.env.TABLE_NAME_USERS,
        Item: {
            userId: uuid,
            firstName: body.firstName,
            isActive: 1
        }
    }
    const result = await putItem(params)
    if (result.success) {
        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    message: "Success!",
                    userId: uuid
                },
                null,
                2
            ),
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify(
                {
                    message: "No firstName!",
                },
                null,
                2
            ),
        }
    }
}