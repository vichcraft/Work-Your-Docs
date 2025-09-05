// Text processing utilities

/**
 * Extracts the last user message from a messages array
 */
export function getLastUserMessage(messages: Array<{ role: string; content: string }>) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      return messages[i];
    }
  }
  return null;
}

/**
 * Checks if a query contains any of the specified keywords
 */
export function containsKeywords(query: string, keywords: readonly string[]): boolean {
  const lowerQuery = query.toLowerCase();
  return keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()));
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
