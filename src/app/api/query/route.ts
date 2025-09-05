import { NextRequest, NextResponse } from 'next/server';
import { generateRAGResponse } from '../../../../backend/lib/rag';

export async function POST(req: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME || !process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    const { query, topK = 5 } = await req.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log(`Processing query: ${query}`);
    const result = await generateRAGResponse(query, topK);
    
    return NextResponse.json({
      success: true,
      query,
      response: result.response,
      sources: result.sources.map(source => ({
        title: source.metadata.title,
        source: source.metadata.source,
        score: source.score,
        content: source.content.substring(0, 200) + '...', // Truncate for response
      })),
    });
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}
