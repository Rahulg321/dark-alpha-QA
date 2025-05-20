"use server";

import { ticket, Ticket } from "@/lib/db/schema";
import { newTicketFormSchema, NewTicketFormSchemaType } from "@/components/forms/new-ticket-form";
import { auth } from "../(auth)/auth";
import { createTicket } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function createTicketServerAction(
  ticketFormValues: NewTicketFormSchemaType,
  content: string
) {

    try {
        const authSession = await auth();

    if (!authSession?.user) {
        return {
            error: "Unauthorized"
        }
    }
    
    const userId = authSession.user.id;

    const {success, data, error} = newTicketFormSchema.safeParse({
        title: ticketFormValues.title,
        description: ticketFormValues.description,
        content: content,
    });

    if (!success) {
        return {
            error: "Invalid ticket data"
        }
    }

    const [insertedTicket] = await createTicket(data.title, data.description, content, userId);
    console.log(insertedTicket);

    revalidatePath("/tickets");

    return {
        success: true,
        data: insertedTicket
    }
    } catch (error) {
        console.error(error);
        return {
            error: "Failed to create ticket"
        }

    }
}


