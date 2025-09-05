# RAG System Setup Guide

This guide will help you set up the RAG (Retrieval-Augmented Generation) system with Pinecone and Google Gemini.

## Prerequisites

1. **Pinecone Account**: Sign up at [pinecone.io](https://pinecone.io)
2. **Google AI Studio API Key**: Get your API key from [aistudio.google.com](https://aistudio.google.com)
3. **VAPI Account**: For voice agent functionality

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=your_pinecone_index_name_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here

# Google Gemini Configuration
GOOGLE_API_KEY=your_google_gemini_api_key_here

# VAPI Configuration
VAPI_PRIVATE_API_KEY=your_vapi_private_api_key_here
```

## Pinecone Index Setup

1. Go to your Pinecone console
2. Create a new index with these settings:
   - **Name**: `your_index_name` (use the same name in PINECONE_INDEX_NAME)
   - **Dimensions**: `768` (for Gemini embedding-001 model)
   - **Metric**: `cosine`
   - **Environment**: Choose your preferred environment

## Getting Your API Keys

### Pinecone API Key
1. Log in to [Pinecone Console](https://app.pinecone.io)
2. Go to API Keys section
3. Copy your API key

### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key

### VAPI API Key
1. Log in to [VAPI Dashboard](https://dashboard.vapi.ai)
2. Go to API Keys section
3. Copy your private API key

## Sample Documentation

The system includes sample documentation files in `/backend/docs/`:
- `api-guide.txt` - API documentation
- `user-manual.txt` - User manual
- `technical-specs.txt` - Technical specifications

## Running the System

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Index documents**:
   - Go to `http://localhost:3000/admin`
   - Click "Index Documents" to process the sample docs

4. **Test the system**:
   - Use the admin interface to test queries
   - Try the voice agent at `http://localhost:3000/chat`

## API Endpoints

- `POST /api/index-documents` - Index documents into Pinecone
- `POST /api/query` - Query the RAG system
- `POST /api/vapi` - Voice agent with RAG integration

## Testing Queries

Try these sample queries:
- "How do I authenticate with the API?"
- "What are the system requirements?"
- "How do I create a new user account?"
- "What security measures are in place?"

## Troubleshooting

1. **Missing environment variables**: Make sure all required API keys are set in `.env.local`
2. **Pinecone connection issues**: Verify your API key and index name
3. **Gemini API errors**: Check your Google API key and quota
4. **Document indexing fails**: Ensure the docs directory exists and contains .txt files

## File Structure

```
backend/
├── docs/                    # Sample documentation files
├── lib/
│   ├── pinecone.ts         # Pinecone client setup
│   ├── gemini.ts           # Gemini AI integration
│   ├── document-processor.ts # Document processing utilities
│   └── rag.ts              # RAG system implementation
src/app/api/
├── index-documents/route.ts # Document indexing endpoint
├── query/route.ts          # Query endpoint
└── vapi/route.ts           # Voice agent endpoint
src/app/admin/page.tsx      # Admin interface
```
