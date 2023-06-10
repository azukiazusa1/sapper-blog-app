import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { Env } from "./env.ts";

const configuration = new Configuration({
  apiKey: Env.openaiApiKey,
});
const openai = new OpenAIApi(configuration);

const maxInputLength = 3500;
const maxSummaryLength = 400;
const maxRecursion = 10; // 念のため

function chunkString(str: string, chunkLength: number): string[] {
  const chunks: string[] = [];
  let index = 0;
  while (index < str.length) {
    chunks.push(str.slice(index, index + chunkLength));
    index += chunkLength;
  }
  return chunks;
}

function summaryPrompt(text: string): string {
  return `以下の文章を200字程度の日本語で要約してください。\n\n${text}`;
}

/**
 * Get a summary of the text, using GPT-
 * @param text The text to summarize
 * @param level The current recursion level (used to prevent infinite recursion)
 * @returns The summary
 */
export async function getSummary(text: string, level = 1): Promise<string> {
  if (text.length <= maxSummaryLength || level > maxRecursion) {
    return text;
  }

  const summaryChunks = await generateSummaryChunks(text);
  const joinedSummary = summaryChunks.join("\n");
  return getSummary(joinedSummary, level + 1);
}

/**
 * Generates summary chunks from a given text
 * @param text A string containing the text to summarize
 * @param maxInputLength The maximum length of the input text
 * @param generateSummaryChunk A function that generates a summary chunk from a given chunk of text
 */
async function generateSummaryChunks(text: string): Promise<string[]> {
  const textChunks = chunkString(text, maxInputLength);
  const summaryChunks = await Promise.all(
    textChunks.map((chunk) => generateSummaryChunk(chunk))
  );
  return summaryChunks;
}

// function to generate a summary chunk from a given text
// uses OpenAI's GPT-3 3.5 Turbo model to generate a summary
// of a given text
// maxSummaryLength is the number of tokens that the summary should have
// at most
async function generateSummaryChunk(text: string): Promise<string> {
  const messages: ChatCompletionRequestMessage[] = [
    { role: "system", content: "あなたはプロの編集者です。" },
    { role: "user", content: summaryPrompt(text) },
  ];
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens: maxSummaryLength,
    messages: messages,
  });
  const chunkSummary = completion.data.choices[0]?.message?.content || "";
  return chunkSummary;
}

export async function getSlug(text: string): Promise<string> {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `(入力値)を英訳してからスラッグに変換してください。
例: (入力値)こんにちは、世界
(出力)hello-world

(入力値)${text}
(出力)`,
      },
    ],
  });
  const slug = completion.data.choices[0]?.message?.content || "";
  return slug;
}
