"use server";

import { ticket, Ticket } from "@/lib/db/schema";
import { newTicketFormSchema, NewTicketFormSchemaType } from "@/components/forms/new-ticket-form";
import { auth } from "../(auth)/auth";
import { createTicket } from "@/lib/db/queries";
import * as z from "zod";
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

    const [insertedTicket] = await createTicket(ticketFormValues.title, ticketFormValues.description, content, userId);
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


