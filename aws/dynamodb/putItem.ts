import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb"
import { ddbDocClient } from "./libs/ddbDocClient.js"

export const putItem = async (params: PutCommandInput) => {
  
  try {
    const data = await ddbDocClient.send(new PutCommand(params))
    console.log("Success - item added or updated", data)
    return {
      success: true
    }
  } catch (error) {
    console.log("Error", error.stack)
    return {
      success: false,
      error: error
    }
  }
}