import fs from 'fs';
import path from 'path';
import { generateEmbedding } from './gemini';
import { getPineconeIndex } from './pinecone';

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    title: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    let chunk = text.slice(start, end);
    
    // Try to break at sentence boundaries
    if (end < text.length) {
      const lastSentence = chunk.lastIndexOf('.');
      const lastNewline = chunk.lastIndexOf('\n');
      const breakPoint = Math.max(lastSentence, lastNewline);
      
      if (breakPoint > start + chunkSize * 0.5) {
        chunk = chunk.slice(0, breakPoint + 1);
      }
    }
    
    chunks.push(chunk.trim());
    start = start + chunk.length - overlap;
  }
  
  return chunks.filter(chunk => chunk.length > 0);
}

export async function processDocument(filePath: string): Promise<DocumentChunk[]> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, path.extname(filePath));
  const chunks = chunkText(content);
  
  const documentChunks: DocumentChunk[] = chunks.map((chunk, index) => ({
    id: `${fileName}-${index}`,
    content: chunk,
    metadata: {
      source: filePath,
      title: fileName,
      chunkIndex: index,
      totalChunks: chunks.length,
    },
  }));
  
  return documentChunks;
}

export async function indexDocumentChunks(chunks: DocumentChunk[]): Promise<void> {
  const index = getPineconeIndex();
  
  for (const chunk of chunks) {
    try {
      const embedding = await generateEmbedding(chunk.content);
      
      await index.upsert([
        {
          id: chunk.id,
          values: embedding,
          metadata: {
            content: chunk.content,
            ...chunk.metadata,
          },
        },
      ]);
      
      console.log(`Indexed chunk: ${chunk.id}`);
    } catch (error) {
      console.error(`Error indexing chunk ${chunk.id}:`, error);
    }
  }
}

export async function processAllDocuments(docsDir: string): Promise<void> {
  const files = fs.readdirSync(docsDir);
  const textFiles = files.filter(file => file.endsWith('.txt'));
  
  console.log(`Found ${textFiles.length} text files to process`);
  
  for (const file of textFiles) {
    const filePath = path.join(docsDir, file);
    console.log(`Processing: ${file}`);
    
    try {
      const chunks = await processDocument(filePath);
      await indexDocumentChunks(chunks);
      console.log(`Successfully processed: ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}
