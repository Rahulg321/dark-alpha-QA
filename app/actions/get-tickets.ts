"use server";

import { getTickets } from "@/lib/db/queries";
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
  ilike,
  arrayOverlaps,
  or,
  type SQL,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

interface GetTicketsResult {
  data: Ticket[];
  totalCount: number;
  totalPages: number;
}

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

/**
 * get all tickets with pagination and filter by ticket type
 *
 * @param search - search query
 * @param offset - offset
 * @param limit - limit
 * @param ticketStatus - ticket status
 * @returns
 */
export const GetAllTickets = async({
  search,
  offset = 0,
  limit = 20,
  ticketStatus,
}: {
  search?: string | undefined;
  offset?: number;
  limit?: number;
  ticketStatus?: TicketStatus[];
}): Promise<GetTicketsResult> => {
  console.log("this")
  const [data, totalCount] = await Promise.all([
    db.select().from(ticket).where(or(ilike(ticket.title, '%'+search+'%'), or(ilike(ticket.description, '%'+search+'%'), or(ilike(ticket.content, '%'+search+'%'))))).offset(offset).limit(limit),
    db.select({value: count() }).from(ticket).where(or(ilike(ticket.title, '%'+search+'%'), or(ilike(ticket.description, '%'+search+'%'), or(ilike(ticket.content, '%'+search+'%'))))).offset(offset).limit(limit),
  ]);
  console.log("finished")

  console.log(data);
  console.log(totalCount);

  const totalPages = Math.ceil(totalCount / limit);
  return {data, totalCount, totalPages};
}

