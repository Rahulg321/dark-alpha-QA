"use server";

import { ticket, Ticket } from "@/lib/db/schema";
import {
  newTicketFormSchema,
  NewTicketFormSchemaType,
} from "@/components/forms/new-ticket-form";
import { auth } from "../(auth)/auth";
import { createTicket } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function createTicketServerAction(formData: FormData) {
  try {
    const authSession = await auth();

    if (!authSession?.user) {
      return {
        error: "Unauthorized",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const tags = (formData.get("tags") as string)?.split(",") ?? [];

    if (tags.length === 0) {
      return {
        error: "Tags are required",
      };
    }

    console.log("inside server action");
    console.log(title, description, content, tags);

    const [ticket] = await createTicket(
      title,
      description,
      content,
      authSession.user.id,
      tags
    );

    console.log("ticket created", ticket);

    revalidatePath("/tickets");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to create ticket",
    };
  }
}
