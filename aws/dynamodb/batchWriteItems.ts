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
  message: Record<string, WriteRequest[]>[] | string
}

const batchWriteItems = async (
  writeRequest: WriteRequest[],
  tableName: string,
): Promise<Record<string, WriteRequest[]>> => {
  const params: BatchWriteItemCommandInput = {
    RequestItems: {
      [tableName]: writeRequest,
    },
  }
  try {
    const response = await ddbClient.send(new BatchWriteItemCommand(params))
    return response.UnprocessedItems || {}
  } catch (error) {
    return error
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
  let output: Record<string, WriteRequest[]>[] = []

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
      const unprocessedItems = await batchWriteItems(itemsArray, tableName)
      if (unprocessedItems && unprocessedItems.length) {
        output.push(unprocessedItems)
      }
      console.log(`BatchWrite response: ${JSON.stringify(unprocessedItems)}`)
    } catch (error) {
      output.push(error)
      console.log(`BatchWrite error: ${JSON.stringify(error)}`)
    }
  }
  return { isSuccess: true, message: output }
}
