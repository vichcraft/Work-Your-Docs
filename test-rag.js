// Simple test script to verify RAG system works
const { generateRAGResponse } = require('./backend/lib/rag');

async function testRAG() {
  try {
    console.log('Testing RAG system...');
    
    // Set up environment variables for testing
    process.env.GOOGLE_API_KEY = 'test-key';
    process.env.PINECONE_API_KEY = 'test-key';
    process.env.PINECONE_INDEX_NAME = 'test-index';
    
    const result = await generateRAGResponse('What is the API documentation about?');
    console.log('RAG Response:', result.response);
    console.log('Sources:', result.sources.length);
  } catch (error) {
    console.error('RAG Test Error:', error.message);
  }
}

testRAG();
