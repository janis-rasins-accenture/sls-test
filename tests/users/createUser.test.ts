import {
  APIGatewayEvent,
  APIGatewayEventIdentity,
  APIGatewayProxyEventMultiValueHeaders,
} from 'aws-lambda'
import * as createUserCall from '../../handlers/users/createUser'
import * as putItemCall from '../../aws/dynamodb/putItem'

describe('Test create user handler', () => {
  let mockPutItem: jest.SpyInstance
  beforeAll(() => {
    mockPutItem = jest
      .spyOn(putItemCall, 'putItem')
      .mockReturnValue(Promise.resolve({ success: true }))
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('Will create new user', async () => {
    const createUserResponse = jest.spyOn(createUserCall, 'handler')
    console.log('createUserResponse: ', createUserResponse)
    expect(createUserResponse).toHaveBeenCalledTimes(1)
    expect(createUserResponse).toBeCalledWith(mockAPIGatewayEvent)
    // expect(helloCall).toBeCalledWith(mockAPIGatewayEvent)
    // expect(response.statusCode).toEqual(200)
    // expect(JSON.parse(response.body).message).toEqual(callBody.message)
    // expect(JSON.parse(response.body).data).toEqual(callBody.data)
  })
})

const createUserRequest = {
  avatarUrl: 'http://placehold.it/32x32',
  firstName: 'CharleneTest',
  lastName: 'PadillaTest',
  email: 'charlenepadilla@franscene.com',
  userName: 'CharleneTest_PadillaTest',
}
const mockAPIGatewayEvent: APIGatewayEvent = {
  body: JSON.stringify(createUserRequest),
  headers: {},
  isBase64Encoded: false,
  pathParameters: null,
  queryStringParameters: null,
  requestContext: {
    accountId: 'offlineContext_accountId',
    apiId: 'offlineContext_apiId',
    authorizer: {
      jwt: {},
    },
    domainName: 'offlineContext_domainName',
    domainPrefix: 'offlineContext_domainPrefix',
    requestId: 'offlineContext_resourceId',
    stage: '',
    httpMethod: 'GET',
    protocol: 'HTTP/1.1',
    path: 'path',
    requestTimeEpoch: 1686568437839,
    identity: {} as APIGatewayEventIdentity,
    resourceId: '123',
    resourcePath: 'path',
  },
  stageVariables: null,
  httpMethod: 'GET',
  multiValueHeaders: {} as APIGatewayProxyEventMultiValueHeaders,
  path: '',
  resource: '',
  multiValueQueryStringParameters: null,
}
const responseData = {
  body: null,
  headers: {},
  isBase64Encoded: false,
  pathParameters: null,
  queryStringParameters: null,
  requestContext: {},
  stageVariables: null,
  httpMethod: 'GET',
  multiValueHeaders: {},
  path: '/local/hello',
  resource: '',
  multiValueQueryStringParameters: null,
}
