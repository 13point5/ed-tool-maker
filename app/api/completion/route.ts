import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, model, temperature, apiKey } = await req.json();

  const openai = new OpenAI({
    apiKey,
  });

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.chat.completions.create({
    model,
    stream: true,
    temperature,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
