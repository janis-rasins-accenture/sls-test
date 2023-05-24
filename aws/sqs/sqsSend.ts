import { SendMessageCommand, SendMessageCommandInput } from '@aws-sdk/client-sqs'
import { sqsClient } from './sqsClient'

export const sqsSendMessage = async (messageBody: string) => {
  const SQS_URL = process.env.SQS_URL
  if (!SQS_URL) {
    throw Error('No URL for SQS message')
  }
  if (!messageBody) {
    throw Error('No body for SQS message')
  }
  const params: SendMessageCommandInput = {
    MessageBody: messageBody,
    QueueUrl: SQS_URL,
  }

  try {
    const data = await sqsClient.send(new SendMessageCommand(params))
    console.log(`Success, message sent. MessageID: ${data.MessageId}`)
    return data // For unit tests.
  } catch (error) {
    console.log(`SQS error: ${error}`)
  }
}
