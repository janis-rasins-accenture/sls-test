import { PutCommandInput, PutCommandOutput } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from './libs/ddbDocClient'
import { putItem } from './putItem'

describe('Test put item', () => {
  let mockDdbDocClient: jest.SpyInstance
  it('Put item into table', async () => {
    const putOutput: PutCommandOutput = {
      $metadata: {
        httpStatusCode: 200,
      },
    }
    const params: PutCommandInput = {
      TableName: 'some-table',
      Item: {
        userId: 'some-id',
      },
    }
    mockDdbDocClient = jest.spyOn(ddbDocClient, 'send').mockResolvedValue(putOutput as never)
    const response = await putItem(params)
    expect(mockDdbDocClient).toHaveBeenCalledTimes(1)
    expect(response.success).toBe(true)
  })
})
