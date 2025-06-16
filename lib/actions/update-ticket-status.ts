"use server";

import { auth } from "@/app/(auth)/auth";
import { db } from "../db/queries";
import { ticket } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateTicketStatus(
  ticketId: string,
  status: "open" | "closed"
) {
  try {
    const authSession = await auth();
    if (!authSession?.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
  } catch (error) {
    console.error("Error updating ticket status", error);
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    await db
      .update(ticket)
      .set({
        status,
      })
      .where(eq(ticket.id, ticketId));

    revalidatePath(`/admin/tickets/${ticketId}`);
    revalidatePath(`/admin/tickets`);
    revalidatePath(`/tickets`);

    return {
      success: true,
      message: "Ticket status updated",
    };
  } catch (error) {
    console.error("Error updating ticket status", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update ticket status",
    };
  }
}
