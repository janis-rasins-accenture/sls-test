import {
  InvokeCommand,
  LambdaClient,
  LogType,
  LambdaClientConfig,
  InvokeCommandInput,
} from '@aws-sdk/client-lambda'

export const invoke = async (funcName: string, payload: object): Promise<void> => {
  const config: LambdaClientConfig = {
    region: process.env.REGION,
    endpoint: process.env.IS_OFFLINE
      ? process.env.LOCAL_LAMBDA_ENDPOINT
      : process.env.LAMBDA_ENDPOINT,
  }
  const commandConfig: InvokeCommandInput = {
    FunctionName: funcName,
    Payload: Buffer.from(JSON.stringify(payload), 'utf-8'),
    LogType: LogType.None,
  }
  const client = new LambdaClient(config)
  const command = new InvokeCommand(commandConfig)

  try {
    const { Payload } = await client.send(command)
    if (Payload) {
      console.log('InvokeCommand payload: ', Buffer.from(Payload).toString())
    }
  } catch (error) {
    console.log('InvokeCommand error ', JSON.stringify(error))
  }
}
