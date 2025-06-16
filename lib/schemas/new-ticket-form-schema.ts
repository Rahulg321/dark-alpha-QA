import { z } from "zod";

export const newTicketFormSchema = z.object({
  title: z.string().min(2).max(50).describe("The title of the ticket"),
  description: z.string().min(10).describe("The description of the ticket"),
  fromName: z
    .string()
    .min(2)
    .max(50)
    .describe("The name of the person who sent the email"),
  fromEmail: z
    .string()
    .email()
    .describe("The email of the person who sent the email"),
  priority: z
    .enum(["low", "medium", "high"])
    .describe("The priority of the ticket"),
  tags: z.array(z.string()).describe("The tags of the ticket"),
});

export type NewTicketFormSchemaType = z.infer<typeof newTicketFormSchema>;
