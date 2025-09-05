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

    // Check if we have valid API keys (not placeholders)
    const hasValidKeys = process.env.GOOGLE_API_KEY && 
                        process.env.PINECONE_API_KEY && 
                        process.env.PINECONE_INDEX_NAME &&
                        !process.env.GOOGLE_API_KEY.includes('placeholder') &&
                        !process.env.PINECONE_API_KEY.includes('placeholder');

    if (hasValidKeys) {
      try {
        // Generate RAG response using the documentation
        const ragResult = await generateRAGResponse(lastMessage.content);
        response = ragResult.response;
      } catch (ragError) {
        console.error("RAG system error:", ragError);
        // Fallback response when RAG system fails
        response = `I understand you're asking about "${lastMessage.content}". I'm having trouble accessing the documentation system right now. Please make sure your API keys are properly configured in the .env.local file.`;
      }
    } else {
      // Demo response when API keys are not configured - simulate RAG behavior
      const sampleDocs = [
        "API Documentation: All API requests require authentication using an API key. Include your API key in the Authorization header: 'Authorization: Bearer YOUR_API_KEY'. The API base URL is: https://api.example.com/v1",
        "User Manual: Create your account by visiting the registration page. Verify your email address and complete your profile information. Set up two-factor authentication for enhanced security.",
        "Technical Specs: Our platform is built using React 18 with TypeScript, Node.js 18+, Express.js, PostgreSQL 14+, and Redis 6+. The system uses microservices architecture with AWS cloud infrastructure."
      ];
      
      // Simple keyword matching to simulate RAG behavior
      const query = lastMessage.content.toLowerCase();
      let relevantDoc = sampleDocs[0]; // Default
      
      if (query.includes('api') || query.includes('authentication') || query.includes('key') || query.includes('endpoint')) {
        relevantDoc = sampleDocs[0];
      } else if (query.includes('user') || query.includes('account') || query.includes('registration') || query.includes('profile')) {
        relevantDoc = sampleDocs[1];
      } else if (query.includes('technical') || query.includes('system') || query.includes('architecture') || query.includes('infrastructure')) {
        relevantDoc = sampleDocs[2];
      }
      
      response = `Based on the documentation, here's what I found about "${lastMessage.content}":\n\n${relevantDoc}\n\nNote: This is a demo response using sample documentation. To get real-time answers from your actual documentation, please configure your Google Gemini and Pinecone API keys in the .env.local file.`;
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
