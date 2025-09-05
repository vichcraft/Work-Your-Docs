// API response utilities

/**
 * Creates a standardized API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string,
  status: number = 200
): Response {
  const response = {
    success,
    ...(data && { ...data }),
    ...(error && { error }),
    ...(message && { message }),
  };

  return Response.json(response, { status });
}

/**
 * Creates a streaming response for text generation
 */
export function createStreamingResponse(text: string, chunkSize: number = 3, delay: number = 30): Response {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      let i = 0;
      const streamText = () => {
        if (i >= text.length) {
          controller.close();
          return;
        }
        
        const chunk = text.slice(i, Math.min(i + chunkSize, text.length));
        controller.enqueue(encoder.encode(chunk));
        i += chunkSize;
        
        setTimeout(streamText, delay);
      };
      streamText();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
