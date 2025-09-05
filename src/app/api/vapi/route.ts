import { NextRequest } from "next/server";

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

    // For text-based chat, we'll simulate a response since Vapi is primarily for voice
    // In a real implementation, you might want to use your own LLM or forward to another service
    const response = await generateTextResponse(lastMessage.content);
    
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

// Helper function to generate text responses
// In a real app, you might integrate with OpenAI, Anthropic, or other LLM providers
async function generateTextResponse(_userMessage: string): Promise<string> {
  // You can integrate with your preferred LLM here
  // For now, return a helpful response
  const responses = [
    "I'm ready to help! What would you like to discuss?",
    "That's an interesting question. Let me think about that...",
    "I understand. How can I assist you with that?",
    "Great point! Here's what I think about that...",
    "I'm here to help you with whatever you need.",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)] + 
    " You can also click the microphone button to start a voice conversation with me!";
}
