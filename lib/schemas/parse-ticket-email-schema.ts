import { z } from "zod";

export const parseTicketEmailSchema = z.object({
  isTicketEmail: z.boolean().describe("Whether the email is a ticket email"),
  title: z.string().describe("The title of the ticket"),
  description: z.string().describe("The description of the ticket"),
  priority: z
    .enum(["low", "medium", "high"])
    .describe("The priority of the ticket"),
  fromName: z.string().describe("The name of the person who sent the email"),
  fromEmail: z
    .string()
    .describe("The email address of the person who sent the email"),
  tags: z.array(z.string()).describe("The appropriate tags of the ticket"),
});

export type ParseTicketEmailSchema = z.infer<typeof parseTicketEmailSchema>;
