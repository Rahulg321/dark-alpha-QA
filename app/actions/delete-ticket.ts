"use server";

import { Ticket, ticket } from "@/lib/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

const DeleteTicketFromDB = async (ticketId: string) => {
  try {
    const oldTicket = await db.select().from(ticket).where(eq(ticket.id, ticketId));
    await db.transaction(async (t) => {
      for (let i = 0; i < oldTicket.tags.length; ++i) {
          await t.update(tags).where({name: oldTicket.tags[i]}).set({ count: sql`${tags.count} - 1` } );
      }
      await db.delete(ticket).where(eq(ticket.id, ticketId));
    });
  } catch (error) {
    console.log("FAILED TO DELETE TICKET");
    console.log(error);
  }
}

export default DeleteTicketFromDB;
