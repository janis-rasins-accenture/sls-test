import {
  APIGatewayEvent,
  APIGatewayEventIdentity,
  APIGatewayProxyEventMultiValueHeaders,
} from 'aws-lambda'

export const mockAPIGatewayEvent: APIGatewayEvent = {
  body: null,
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
