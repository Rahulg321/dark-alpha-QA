import { z } from "zod";

export const createCompanyQuestionSchema = z.object({
  title: z.string().min(1, "Question is required"),
});
