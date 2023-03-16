import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'
import { Env } from './env.js'

const configuration = new Configuration({
  apiKey: Env.openaiApiKey,
})
const openai = new OpenAIApi(configuration)

const maxInputLength = 3500
const maxSummaryLength = 400
const maxRecursion = 10 // 念のため

function chunkString(str: string, chunkLength: number): string[] {
  const chunks: string[] = []
  let index = 0
  while (index < str.length) {
    chunks.push(str.slice(index, index + chunkLength))
    index += chunkLength
  }
  return chunks
}

function summaryPrompt(text: string): string {
  return `以下の文章を200字程度の日本語で要約してください。\n\n${text}`
}

export async function getSummary(text: string, level = 1): Promise<string> {
  // 再帰的要約
  if (text.length <= maxSummaryLength || level > maxRecursion) {
    return text
  }
  const textChunks = chunkString(text, maxInputLength)
  const summaryChunks = await Promise.all(
    textChunks.map(async (chunk) => {
      const messages: ChatCompletionRequestMessage[] = [{ role: 'user', content: summaryPrompt(chunk) }]
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        max_tokens: maxSummaryLength,
        messages: messages,
      })
      const chunkSummary = completion.data.choices[0]?.message?.content || ''
      return chunkSummary
    }),
  )
  const joinedSummary = summaryChunks.join('\n')
  return getSummary(joinedSummary, level + 1)
}
