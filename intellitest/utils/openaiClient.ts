import OpenAI from 'openai';
import { getPrompt } from  './promptList';


const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '', // Ensure your API key is stored securely
  });

 
  

//   const params: OpenAI.Chat.ChatCompletionCreateParams = {
//     messages: [{ role: 'user', content: 'Say this is a test' }],
//     model: 'gpt-3.5-turbo',
//   };
//   const chatCompletion: OpenAI.Chat.ChatCompletion = await client.chat.completions.create(params);

export async function generateOutput(prompt: string) {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
    };
    const completion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
    return completion.choices[0].message.content;
}

export async function testPrompt() {
    return await generateOutput('Your name is John and you are a lawyer.');
}

export async function testPromptWithReplacements(replacements: Record<string, string>) {
    return await generateOutput(getPrompt('testPrompt', replacements));
}