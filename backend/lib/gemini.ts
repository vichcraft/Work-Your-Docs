import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

export const getEmbeddingModel = () => {
  return genAI.getGenerativeModel({ model: 'embedding-001' });
};

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = getEmbeddingModel();
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateResponse(prompt: string, context?: string): Promise<string> {
  const model = getGeminiModel();
  
  const fullPrompt = context 
    ? `Based on the following context, please answer the question. If the context doesn't contain relevant information, say so.\n\nContext: ${context}\n\nQuestion: ${prompt}`
    : prompt;
  
  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  return response.text();
}
