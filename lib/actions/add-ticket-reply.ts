"use server";

import { z } from "zod";

import { ticketReplySchema } from "@/lib/schemas/ticket-reply-schema";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { ticketReplies } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export interface SendTicketReplyActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data"
    | "user_not_found"
    | "invalid_method";
}

export const sendTicketReply = async (
  _: SendTicketReplyActionState,
  formData: FormData
): Promise<SendTicketReplyActionState> => {
  const authSession = await auth();

  if (!authSession) {
    console.log("user_not_found");
    return { status: "user_not_found" };
  }

  const validatedData = ticketReplySchema.safeParse({
    subject: formData.get("subject"),
    content: formData.get("content"),
    ticketId: formData.get("ticketId"),
  });

  if (!validatedData.success) {
    console.log("invalid_data", validatedData.error);
    return { status: "invalid_data" };
  }

  const { subject, content, ticketId } = validatedData.data;

  try {
    const [createdTicketReply] = await db
      .insert(ticketReplies)
      .values({
        subject,
        content,
        ticketId,
        userId: authSession.user.id,
      })
      .returning();

    console.log("createdTicketReply", createdTicketReply);

    revalidatePath("/tickets");
    revalidatePath("/admin/tickets");
    revalidatePath(`/tickets/${ticketId}`);

    return { status: "success" };
  } catch (error) {
    console.error("error", error);
    return { status: "failed" };
  }

  // This part is unreachable because signIn with redirect throws an error.
  // It's here to satisfy the type-checker for the cases where redirect does not happen.
  return {
    status: "success",
  };
};
