import { QueryCommandInput } from "@aws-sdk/lib-dynamodb"
import { queryItems } from "../../aws/dynamodb/queryItems"
import { returnData } from "../../utils/returnData"

export const handler = async () => {
    const TABLE_NAME_USERS = process.env.TABLE_NAME_USERS
    if (!TABLE_NAME_USERS) {
        console.log('No TABLE_NAME_USERS')
        return
    }
    const params: QueryCommandInput  = {
        IndexName: 'isActiveIndex',
        KeyConditionExpression: "isActive = :i",
        ExpressionAttributeValues: {
            ":i": 1,
        },
        TableName: TABLE_NAME_USERS
    }
    const data =  await queryItems(params)
    return returnData(200, "User list", JSON.stringify(data))
}