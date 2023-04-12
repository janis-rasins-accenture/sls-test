import { UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./libs/ddbDocClient";

export const updateItem = async (params: UpdateCommandInput) => {
  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    console.log("Success - item updated", data);
    return data;
  } catch (error) {
    console.log("Error", error);
  }
};