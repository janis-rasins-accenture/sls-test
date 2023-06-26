import { sqsSendMessage } from './sqsSend'
import { sqsClient } from './sqsClient'
import { SendMessageCommandOutput } from '@aws-sdk/client-sqs'

describe('Test send SQS message', () => {
  let mockSQSsend: jest.SpyInstance
  beforeEach(() => {
    jest.restoreAllMocks()
    process.env = {
      ...OLD_ENV,
      SQS_URL: `http://0.0.0.0:9324/test-createUser`,
    } // Make a copy of process.env
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  it('Will send SQS message', async () => {
    let mockSqsResponse = {} as SendMessageCommandOutput
    mockSQSsend = jest.spyOn(sqsClient, 'send').mockResolvedValue(mockSqsResponse as never)
    const sqsResponse: SendMessageCommandOutput | undefined = await sqsSendMessage(messageBody)
    expect(mockSQSsend).toHaveBeenCalledTimes(1)
    expect(sqsResponse).toEqual({})
  })
})

const messageBody = JSON.stringify({
  message: 'User created',
  userId: 'uniq-uuid',
})

const OLD_ENV = process.env
