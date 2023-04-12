import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb"
import { ddbClient } from "./libs/ddbClient"

export const getItems = async (params: GetItemCommandInput) => {
    try {
        const data = await ddbClient.send(new GetItemCommand(params));
        console.log("Success", data.Item);
        return data.Item
    } catch (error) {
        console.log('Error: ', JSON.stringify(error))
    }
};