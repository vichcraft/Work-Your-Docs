// Centralized type definitions for the application

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
}

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  source: string;
  title: string;
  chunkIndex: number;
  totalChunks: number;
}

export interface SearchResult {
  id: string;
  score: number;
  content: string;
  metadata: DocumentMetadata;
}

export interface RAGResponse {
  response: string;
  sources: SearchResult[];
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QueryRequest {
  query: string;
  topK?: number;
}

export interface IndexDocumentsRequest {
  docsPath?: string;
}

export interface VapiRequest {
  messages: Message[];
  assistantId?: string;
}

export interface SourceSummary {
  title: string;
  source: string;
  score: number;
  content: string;
}

export interface QueryResponse extends APIResponse {
  query?: string;
  response?: string;
  sources?: SourceSummary[];
}

export interface IndexDocumentsResponse extends APIResponse {
  requiresRealKeys?: boolean;
}

// Environment variables interface
export interface EnvironmentConfig {
  VAPI_PRIVATE_API_KEY?: string;
  NEXT_PUBLIC_VAPI_PUBLIC_KEY?: string;
  NEXT_PUBLIC_VAPI_ASSISTANT_ID?: string;
  GOOGLE_API_KEY?: string;
  PINECONE_API_KEY?: string;
  PINECONE_INDEX_NAME?: string;
}

// Configuration interfaces
export interface ChunkingConfig {
  chunkSize: number;
  overlap: number;
}

export interface RAGConfig {
  defaultTopK: number;
  maxContentLength: number;
  chunkingConfig: ChunkingConfig;
}

// Voice agent types
export interface VoiceCallState {
  isActive: boolean;
  isConnecting: boolean;
  status: string;
}

export interface VapiMessage {
  type: string;
  role: string;
  transcript?: string;
}
