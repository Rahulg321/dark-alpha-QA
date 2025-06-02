import { z } from "zod";

// define a schema for the generate answer
export const generateAnswerSchema = z.object({
  answer: z.string().describe("Answer to the question."),
});
