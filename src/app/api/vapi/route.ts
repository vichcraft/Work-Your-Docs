import { NextRequest } from "next/server";
import { generateRAGResponse } from "../../../../backend/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: "user" | "assistant" | "system"; content: string }[];
    };

    // Check for required API keys
    if (!process.env.VAPI_PRIVATE_API_KEY) {
      return new Response("Missing VAPI_PRIVATE_API_KEY", { status: 500 });
    }

    // Use the last user message as the prompt for the assistant
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return new Response("Invalid message format", { status: 400 });
    }

    let response: string;

    try {
      // Check if we have valid API keys (not placeholders)
      const hasValidKeys = process.env.GOOGLE_API_KEY && 
                          process.env.PINECONE_API_KEY && 
                          process.env.PINECONE_INDEX_NAME &&
                          !process.env.GOOGLE_API_KEY.includes('placeholder') &&
                          !process.env.PINECONE_API_KEY.includes('placeholder');

      if (hasValidKeys) {
        // Generate RAG response using the documentation
        const ragResult = await generateRAGResponse(lastMessage.content);
        response = ragResult.response;
      } else {
        // Fallback response when API keys are not configured
        response = `I understand you're asking about "${lastMessage.content}". However, I need to be configured with valid API keys to access the documentation and provide detailed answers. Please set up your Google Gemini and Pinecone API keys in the .env.local file to enable the RAG (Retrieval-Augmented Generation) system.`;
      }
    } catch (ragError) {
      console.error("RAG system error:", ragError);
      // Fallback response when RAG system fails
      response = `I understand you're asking about "${lastMessage.content}". I'm having trouble accessing the documentation system right now. Please make sure your API keys are properly configured in the .env.local file.`;
    }
    
    // Stream the response back
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        let i = 0;
        const streamText = () => {
          if (i >= response.length) {
            controller.close();
            return;
          }
          
          // Send chunks of the response
          const chunk = response.slice(i, Math.min(i + 3, response.length));
          controller.enqueue(encoder.encode(chunk));
          i += 3;
          
          setTimeout(streamText, 30);
        };
        streamText();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Vapi API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
