"use server";

import { newTicketFormSchema } from "@/lib/schemas/new-ticket-form-schema";
import { auth } from "../(auth)/auth";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/queries";
import { ticket } from "@/lib/db/schema";

export async function createTicketServerAction(formData: FormData) {
  try {
    const authSession = await auth();

    if (!authSession?.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("description") as string;
    const tags = JSON.parse(formData.get("tags") as string) ?? [];
    const fromName = formData.get("fromName") as string;
    const fromEmail = formData.get("fromEmail") as string;
    const priority = formData.get("priority") as string;

    const { success, data } = newTicketFormSchema.safeParse({
      title,
      description,
      content,
      tags,
      fromName,
      fromEmail,
      priority,
    });

    if (!success) {
      return {
        success: false,
        message: "error could not parse zof schema",
      };
    }

    const [createdTicket] = await db
      .insert(ticket)
      .values({
        title: data.title,
        description: data.description,
        status: "open",
        tags: data.tags,
        fromName: data.fromName,
        fromEmail: data.fromEmail,
        priority: data.priority,
        type: "website",
      })
      .returning();

    console.log("ticket created", createdTicket);

    revalidatePath("/tickets");
    revalidatePath("/admin/tickets");

    return {
      success: true,
      message: "Ticket created successfully",
      ticketId: createdTicket.id,
    };
  } catch (error) {
    console.error("error creating ticket", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create ticket",
    };
  }
}
