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
    await db.delete(ticket).where(eq(ticket.id, ticketId));
  } catch (error) {
    console.log("FAILED TO DELETE TICKET");
    console.log(error);
  }
}

export default DeleteTicketFromDB;
