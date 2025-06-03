import * as z from "zod";

export const addAnswerSchema = z.object({
  content: z
    .string()
    .min(10, "Content is required with at least 10 characters"),
});

export type AddAnswerFormValues = z.infer<typeof addAnswerSchema>;
