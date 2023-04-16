import {
  AttributeValue,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  WriteRequest,
} from '@aws-sdk/client-dynamodb'
import { ddbClient } from './libs/ddbClient'

const BATCH_MAX = 25

interface BatchWriteResponseIF {
  isSuccess: boolean
  message: string
}

const batchWriteItems = async (
  writeRequest: WriteRequest[],
  tableName: string,
): Promise<BatchWriteResponseIF> => {
  const params: BatchWriteItemCommandInput = {
    RequestItems: {
      [tableName]: writeRequest,
    },
  }
  try {
    const response = await ddbClient.send(new BatchWriteItemCommand(params))
    return { isSuccess: true, message: JSON.stringify(response) }
  } catch (error) {
    return { isSuccess: false, message: JSON.stringify(error) }
  }
}

export const batchWrite = async (
  items: Record<string, AttributeValue>[],
  tableName: string,
): Promise<BatchWriteResponseIF> => {
  if (!tableName) {
    return { isSuccess: false, message: 'No table name!' }
  }
  if (!items.length) {
    return { isSuccess: false, message: 'No items!' }
  }
  const BATCHES = Math.floor((items.length + BATCH_MAX - 1) / BATCH_MAX)
  let output: BatchWriteResponseIF[] = []

  for (let batch = 0; batch < BATCHES; batch++) {
    const itemsArray: WriteRequest[] = []

    for (let ii = 0; ii < BATCH_MAX; ii++) {
      const index = batch * BATCH_MAX + ii

      if (index >= items.length) break

      itemsArray.push({
        PutRequest: {
          Item: items[index],
        },
      })
    }

    console.log('Batch', batch, 'write', itemsArray.length, 'items')
    try {
      const response: BatchWriteResponseIF = await batchWriteItems(itemsArray, tableName)
      output.push(response)
      console.log(`BatchWrite response: ${JSON.stringify(response)}`)
    } catch (error) {
      output.push(error)
      console.log(`BatchWrite response: ${JSON.stringify(error)}`)
    }
  }
  return { isSuccess: true, message: JSON.stringify(output) }
}
