import { PutCommand } from "@aws-sdk/lib-dynamodb"
import { ddbDocClient } from "../libs/ddbDocClient.js"

export const putItem = async (params) => {
  
  try {
    const data = await ddbDocClient.send(new PutCommand(params))
    console.log("Success - item added or updated", data)
    return data
  } catch (err) {
    console.log("Error", err.stack)
    return err
  }
}