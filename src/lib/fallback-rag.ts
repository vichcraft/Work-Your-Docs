// Fallback RAG service for when API keys are not configured

import { containsKeywords } from './utils';
import { KEYWORD_MAPPINGS } from './constants';

// Sample documentation for fallback mode
export const FALLBACK_DOCS = {
  api: "API Documentation: All API requests require authentication using an API key. Include your API key in the Authorization header: 'Authorization: Bearer YOUR_API_KEY'. The API base URL is: https://api.example.com/v1. Endpoints include GET /users, POST /users, GET /products, and GET /products/{id}.",
  
  user: "User Manual: Create your account by visiting the registration page. Verify your email address and complete your profile information. Set up two-factor authentication for enhanced security. The dashboard provides quick access to all features, recent activity summary, and notifications.",
  
  technical: "Technical Specs: Our platform is built using React 18 with TypeScript, Node.js 18+, Express.js, PostgreSQL 14+, and Redis 6+. The system uses microservices architecture with AWS cloud infrastructure. API performance: < 200ms response time, 10,000 requests per second, 99.9% uptime SLA.",
} as const;

export type DocCategory = keyof typeof FALLBACK_DOCS;

/**
 * Determines the most relevant document category based on query keywords
 */
export function categorizeQuery(query: string): DocCategory {
  const lowerQuery = query.toLowerCase();
  
  if (containsKeywords(lowerQuery, KEYWORD_MAPPINGS.api)) {
    return 'api';
  }
  
  if (containsKeywords(lowerQuery, KEYWORD_MAPPINGS.user)) {
    return 'user';
  }
  
  if (containsKeywords(lowerQuery, KEYWORD_MAPPINGS.technical)) {
    return 'technical';
  }
  
  // Default to API docs for unmatched queries
  return 'api';
}

/**
 * Generates a fallback RAG response using simple keyword matching
 */
export function generateFallbackResponse(query: string): string {
  const category = categorizeQuery(query);
  const relevantDoc = FALLBACK_DOCS[category];
  
  if (query.toLowerCase().includes('help') || query.toLowerCase().includes('what')) {
    return `I can help you with API documentation, user guides, or technical specifications. Here's some information that might be relevant:\n\n${relevantDoc}\n\nNote: This is a demo response using sample documentation. To get real-time answers from your actual documentation, please configure your Google Gemini and Pinecone API keys in the .env.local file.`;
  }
  
  return `Based on the documentation, here's what I found about "${query}":\n\n${relevantDoc}\n\nNote: This is a demo response using sample documentation. To get real-time answers from your actual documentation, please configure your Google Gemini and Pinecone API keys in the .env.local file.`;
}

/**
 * Generates a generic help response when no specific query is detected
 */
export function generateGenericHelpResponse(): string {
  return "I can help you with API documentation, user guides, or technical specifications. Please ask about specific topics like 'API authentication', 'user account setup', or 'technical requirements'.";
}
