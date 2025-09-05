import { NextRequest, NextResponse } from 'next/server';
import { processAllDocuments } from '../../../../backend/lib/document-processor';

export async function POST(req: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME || !process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    // Check if API keys are placeholders
    const hasPlaceholderKeys = process.env.GOOGLE_API_KEY.includes('placeholder') || 
                              process.env.PINECONE_API_KEY.includes('placeholder') ||
                              process.env.PINECONE_INDEX_NAME.includes('placeholder');

    if (hasPlaceholderKeys) {
      return NextResponse.json(
        { 
          error: 'API keys are set to placeholder values. Please replace them with actual API keys in .env.local to enable document indexing.',
          requiresRealKeys: true
        },
        { status: 400 }
      );
    }

    const { docsPath } = await req.json();
    const docsDir = docsPath || '/Users/kunal/Code/scehacks/212-sce-priv/backend/docs';
    
    console.log(`Starting document indexing from: ${docsDir}`);
    await processAllDocuments(docsDir);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Documents indexed successfully' 
    });
  } catch (error) {
    console.error('Error indexing documents:', error);
    return NextResponse.json(
      { error: 'Failed to index documents' },
      { status: 500 }
    );
  }
}
