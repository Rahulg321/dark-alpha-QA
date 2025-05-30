"use server";

import { Replies, replies } from "@/lib/db/schema";
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

interface GetRepliesResult {
  data: Replies[];
}

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export const GetAllReplies = async({
  ticketId,
}: {
  ticketId: string;
}): Promise<GetRepliesResult> => {
  console.log("this", ticketId)
  const data = await db.select().from(replies).orderBy(desc(replies.createdAt)).where(eq(replies.ticketId, ticketId));
  console.log("finished")

  console.log(data);

  return {data};
}

