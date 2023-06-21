import { handler } from './createUser'
import * as putItemCall from '../../aws/dynamodb/putItem'
import * as SqsSendMessage from '../../aws/sqs/sqsSend'
import { SendMessageCommandOutput } from '@aws-sdk/client-sqs'
import { mockAPIGatewayEvent } from '../../mockData/mockData'

describe('Test create user handler', () => {
  let mockPutItem: jest.SpyInstance
  let mockSqsSendMessage: jest.SpyInstance
  const mockSqsOutput = {} as SendMessageCommandOutput

  beforeAll(() => {})

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('Will create new user', async () => {
    const mockEvent = {
      ...mockAPIGatewayEvent,
      body: JSON.stringify(createUserRequest),
    }
    mockPutItem = jest.spyOn(putItemCall, 'putItem').mockResolvedValue({ success: true })
    mockSqsSendMessage = jest
      .spyOn(SqsSendMessage, 'sqsSendMessage')
      .mockResolvedValue(mockSqsOutput)
    const createUserResponse = await handler(mockEvent)
    expect(mockPutItem).toHaveBeenCalledTimes(1)
    expect(mockSqsSendMessage).toHaveBeenCalledTimes(1)
    expect(createUserResponse.statusCode).toBe(200)
  })

  it('Will return 400 error and message No body!', async () => {
    const createUserResponse = await handler(mockAPIGatewayEvent)
    expect(createUserResponse.statusCode).toBe(400)
    expect(JSON.parse(createUserResponse.body).message).toBe('No body!')
  })
})

const createUserRequest = {
  avatarUrl: 'http://placehold.it/32x32',
  firstName: 'CharleneT',
  lastName: 'PadillaT',
  email: 'charlenepadilla@franscene.com',
  userName: 'CharleneT_PadillaT',
}
