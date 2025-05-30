"use server";

import { ticket, Ticket } from "@/lib/db/schema";
import { newTicketFormSchema, NewTicketFormSchemaType } from "@/components/forms/new-ticket-form";
import { editTicketFormSchema, EditTicketFormSchemaType } from "@/components/forms/edit-ticket-form";
import { auth } from "../(auth)/auth";
import { createTicket, editTicket, getTicket, createReply } from "@/lib/db/queries";
import * as z from "zod";
import { revalidatePath } from "next/cache";

export async function getTicketById(
    ticketId: string
) {
    return await getTicket(ticketId);
}

export async function createReplyServerAction(ticketId: string, content: string) {
    try {
        const authSession = await auth();
        if (!authSession?.user) {
            return {
                error: "Unauthorized"
            }
        }

        const userId = authSession.user.id;
        return await createReply(ticketId,userId,content);
    } catch (error) {
        return {
            error: "Failed to create reply"
        }
    }
}

export async function createTicketServerAction(
  ticketFormValues: NewTicketFormSchemaType,
  content: string,
  tags: string[],
) {

    try {
        const authSession = await auth();

    if (!authSession?.user) {
        return {
            error: "Unauthorized"
        }
    }
    
    const userId = authSession.user.id;

    const [insertedTicket] = await createTicket(ticketFormValues.title, ticketFormValues.description, tags, content, userId);
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

export async function editTicketServerAction(
    ticketFormValues: EditTicketFormSchemaType,
    content: string,
    tags: string[],
    ticketId: string,
) {
    try {
        const authSession = await auth();

        if (!authSession?.user) {
            return {
                error: "Unauthorized"
            }
        }

        const userId = authSession.user.id;

        const [editedTicket] = await editTicket(ticketFormValues.title, ticketFormValues.description, tags, content, ticketId);

        revalidatePath("/tickets");

        return {
            success: true,
            data: editedTicket
        }
    } catch (error) {
        console.error(error);
        return {
            error: "Failed to edit ticket"
        }

    }
}

