import { getPineconeIndex } from './pinecone';
import { generateEmbedding, generateResponse } from './gemini';

export interface SearchResult {
  id: string;
  score: number;
  content: string;
  metadata: {
    source: string;
    title: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

export async function searchDocuments(query: string, topK: number = 5): Promise<SearchResult[]> {
  const index = getPineconeIndex();
  const queryEmbedding = await generateEmbedding(query);
  
  const searchResponse = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });
  
  return searchResponse.matches?.map(match => ({
    id: match.id!,
    score: match.score!,
    content: match.metadata?.content as string || '',
    metadata: {
      source: match.metadata?.source as string || '',
      title: match.metadata?.title as string || '',
      chunkIndex: match.metadata?.chunkIndex as number || 0,
      totalChunks: match.metadata?.totalChunks as number || 0,
    },
  })) || [];
}

export async function generateRAGResponse(query: string, topK: number = 5): Promise<{
  response: string;
  sources: SearchResult[];
}> {
  // Search for relevant documents
  const searchResults = await searchDocuments(query, topK);
  
  // Combine the content from search results
  const context = searchResults
    .map(result => `Source: ${result.metadata.title}\nContent: ${result.content}`)
    .join('\n\n');
  
  // Generate response using Gemini
  const response = await generateResponse(query, context);
  
  return {
    response,
    sources: searchResults,
  };
}
