"use server";

import { Ticket, ticket, tags } from "@/lib/db/schema";
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
  sql,
  type SQL,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

const DeleteTicketFromDB = async (ticketId: string) => {
  try {
    const result = await db.select({oldTags: ticket.tags}).from(ticket).where(eq(ticket.id, ticketId));
    const { oldTags } = result[0];
    await db.transaction(async (t) => {
      for (let i = 0; i < oldTags.length; ++i) {
          await t.update(tags).set({ count: sql`${tags.count} - 1` } ).where(eq(tags.name, oldTags[i]));
      }
      await db.delete(ticket).where(eq(ticket.id, ticketId));
    });
  } catch (error) {
    console.log("FAILED TO DELETE TICKET");
    console.log(error);
  }
}

export default DeleteTicketFromDB;
