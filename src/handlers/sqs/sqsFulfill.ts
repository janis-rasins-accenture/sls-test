import { SQSEvent, SQSRecord } from 'aws-lambda'

export const handler = async (event: SQSEvent) => {
  const records: SQSRecord[] = event.Records
  console.log(`Incoming records: ${JSON.stringify(records)}, total: ${records.length}`)
}
