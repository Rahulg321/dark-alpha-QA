"use server";

import { auth } from "@/app/(auth)/auth";
import { db } from "../db/queries";
import { ticket } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteTicketByAdmin(ticketId: string) {
  const authSession = await auth();

  if (!authSession?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!ticketId) {
    return {
      success: false,
      message: "Ticket ID is required",
    };
  }

  try {
    await db.delete(ticket).where(eq(ticket.id, ticketId));

    revalidatePath(`/admin/tickets`);
    revalidatePath(`/tickets`);

    return {
      success: true,
      message: "Ticket deleted",
    };
  } catch (error) {
    console.error("Error deleting ticket", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete ticket",
    };
  }
}
