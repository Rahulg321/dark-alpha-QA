import { z } from "zod";

export const ticketReplySchema = z.object({
  subject: z.string().min(1),
  content: z.string().min(1),
  ticketId: z.string().min(1),
});

export type TicketReply = z.infer<typeof ticketReplySchema>;
