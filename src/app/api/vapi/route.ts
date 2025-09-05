import { NextRequest } from "next/server";

// Simple in-memory documentation for RAG
const docs = {
  "api": "API Documentation: All API requests require authentication using an API key. Include your API key in the Authorization header: 'Authorization: Bearer YOUR_API_KEY'. The API base URL is: https://api.example.com/v1. Endpoints include GET /users, POST /users, GET /products, and GET /products/{id}.",
  "user": "User Manual: Create your account by visiting the registration page. Verify your email address and complete your profile information. Set up two-factor authentication for enhanced security. The dashboard provides quick access to all features, recent activity summary, and notifications.",
  "technical": "Technical Specs: Our platform is built using React 18 with TypeScript, Node.js 18+, Express.js, PostgreSQL 14+, and Redis 6+. The system uses microservices architecture with AWS cloud infrastructure. API performance: < 200ms response time, 10,000 requests per second, 99.9% uptime SLA."
};

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

    // Simple RAG: find relevant documentation based on keywords
    const query = lastMessage.content.toLowerCase();
    let relevantDoc = "";
    
    if (query.includes('api') || query.includes('authentication') || query.includes('key') || query.includes('endpoint')) {
      relevantDoc = docs.api;
    } else if (query.includes('user') || query.includes('account') || query.includes('registration') || query.includes('profile')) {
      relevantDoc = docs.user;
    } else if (query.includes('technical') || query.includes('system') || query.includes('architecture') || query.includes('infrastructure')) {
      relevantDoc = docs.technical;
    } else {
      // Default response for general queries
      relevantDoc = "I can help you with API documentation, user guides, or technical specifications. Please ask about specific topics like 'API authentication', 'user account setup', or 'technical requirements'.";
    }
    
    const response = `Based on the documentation, here's what I found about "${lastMessage.content}":\n\n${relevantDoc}`;
    
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
