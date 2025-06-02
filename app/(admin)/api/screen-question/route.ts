import { openai } from "@ai-sdk/openai";
import { Output, streamObject, streamText } from "ai";
import { generateAnswerSchema } from "@/lib/schemas/generate-answer-schema";
import { google, openaiProvider } from "@/lib/ai/providers";
import { screenQuestionCompany } from "@/lib/ai/tools/screen-question-company";
import { auth } from "@/app/(auth)/auth";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const userSession = await auth();

  if (!userSession) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { prompt }: { prompt: string } = await req.json();

  console.log("prompt", prompt);

  const result = streamText({
    model: openaiProvider("gpt-4o"),
    // model: google("gemini-2.0-flash-001"),

    // experimental_output: Output.object({
    //   schema: generateAnswerSchema,
    // }),
    maxSteps: 5,
    system:
      "You are an AI assistant specialized in answering questions about a company. Your role is to provide accurate, detailed, and contextually relevant answers based on the company's knowledge base. When generating responses:\n\n" +
      "1. Focus on providing comprehensive answers that draw from the company's specific information\n" +
      "2. Structure your responses in a clear, professional manner\n" +
      "3. If the question requires technical details, ensure accuracy and precision\n" +
      "4. Maintain consistency with the company's company information and policies\n" +
      "5. If you're unsure about any information, acknowledge the limitation rather than making assumptions",
    prompt: ` ${prompt}`,
    tools: {
      screenQuestionCompany,
    },
  });

  return result.toDataStreamResponse();
}
