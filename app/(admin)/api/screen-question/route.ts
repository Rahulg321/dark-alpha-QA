import { screenQuestionCompany } from "@/lib/ai/tools/screen-question-company";
import { google } from "@/lib/ai/providers";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, questionText, companyId } = await req.json();
  console.log("inside post screen question route");

  // Prepend context as a user message
  const contextMessages = [
    {
      role: "user",
      content: `Company ID: ${companyId}. Question: ${questionText}`,
    },
    ...messages,
  ];

  console.log("contextMessages", contextMessages);
  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: `
    You are a knowledgeable assistant specialized in answering questions about companies using our knowledge base.
    You have access to company-specific information through the screenQuestionCompany tool.
    When answering:
    1. Use the provided company information to give accurate, contextual responses
    2. If the information isn't available in our knowledge base, clearly state that
    3. Keep responses professional and focused on the company-specific context
    4. Cite sources when possible by referencing the relevant content
    `,
    messages: contextMessages,
    maxSteps: 5,
    toolChoice: "required",
    tools: { screenQuestionCompany },
  });

  return result.toDataStreamResponse();
}
