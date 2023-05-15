import { InvokeCommand, LambdaClient, LogType, LambdaClientConfig } from '@aws-sdk/client-lambda'

export const invoke = async (funcName: string, payload: any) => {
  const config: LambdaClientConfig = {
    region: process.env.REGION,
    endpoint: process.env.IS_OFFLINE
      ? process.env.LOCAL_LAMBDA_ENDPOINT
      : process.env.LAMBDA_ENDPOINT,
  }
  const client = new LambdaClient(config)
  const command = new InvokeCommand({
    FunctionName: funcName,
    Payload: Buffer.from(JSON.stringify(payload)),
    LogType: LogType.None,
  })

  try {
    const { Payload } = await client.send(command)
    let result: any
    if (Payload) {
      result = Buffer.from(Payload).toString()
    }
    return { result }
  } catch (error) {
    console.log(JSON.stringify(error))
  }
}
