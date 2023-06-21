export const streamToString = async (stream: NodeJS.ReadableStream): Promise<string> => {
  return new Promise((resolve, reject) => {
    let chunks: string[] = []
    stream?.on('data', (chunk: string) => chunks.push(chunk.toString()))
    stream?.on('error', reject)
    stream?.on('end', () => resolve(chunks.join('')))
  })
}

export const streamToObject = async (stream: NodeJS.ReadableStream): Promise<JSON> => {
  return JSON.parse(await streamToString(stream))
}
