// Application constants

export const API_ROUTES = {
  VAPI: '/api/vapi',
  QUERY: '/api/query',
  INDEX_DOCUMENTS: '/api/index-documents',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const RAG_CONFIG = {
  DEFAULT_TOP_K: 5,
  DEFAULT_CHUNK_SIZE: 1000,
  DEFAULT_OVERLAP: 200,
  MAX_CONTENT_PREVIEW_LENGTH: 200,
  STREAMING_CHUNK_SIZE: 3,
  STREAMING_DELAY: 30,
} as const;

export const ERROR_MESSAGES = {
  MISSING_VAPI_KEY: 'Missing VAPI_PRIVATE_API_KEY',
  MISSING_ENV_VARS: 'Missing required environment variables',
  INVALID_MESSAGE_FORMAT: 'Invalid message format',
  QUERY_REQUIRED: 'Query is required',
  FAILED_TO_PROCESS_QUERY: 'Failed to process query',
  FAILED_TO_INDEX_DOCUMENTS: 'Failed to index documents',
  PLACEHOLDER_KEYS: 'API keys are set to placeholder values. Please replace them with actual API keys in .env.local to enable document indexing.',
  RAG_SYSTEM_ERROR: "I'm having trouble accessing the documentation system right now. Please make sure your API keys are properly configured in the .env.local file.",
} as const;

export const REQUIRED_ENV_VARS = [
  'PINECONE_API_KEY',
  'PINECONE_INDEX_NAME',
  'GOOGLE_API_KEY',
] as const;

export const VAPI_EVENTS = {
  CALL_START: 'call-start',
  CALL_END: 'call-end',
  VOLUME_LEVEL: 'volume-level',
  MESSAGE: 'message',
  ERROR: 'error',
} as const;

export const GEMINI_MODELS = {
  TEXT: 'gemini-1.5-flash',
  EMBEDDING: 'embedding-001',
} as const;

// Default document paths
export const DEFAULT_DOCS_PATH = 'backend/docs';

// Keyword mappings for fallback RAG
export const KEYWORD_MAPPINGS = {
  api: ['api', 'authentication', 'key', 'endpoint', 'request', 'response'],
  user: ['user', 'account', 'registration', 'profile', 'signup', 'login'],
  technical: ['technical', 'system', 'architecture', 'infrastructure', 'specs', 'requirements'],
} as const;
