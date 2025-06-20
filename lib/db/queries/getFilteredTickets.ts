import prisma from '@/lib/prisma';     // your Prisma client instance
import { Prisma } from '@prisma/client';

export type TicketFilterOptions = {
  status?:  string;        // "open" | "closed"
  type?:    string;        // "email" | "website"
  tag?:     string;        // tag name
  query?:   string;        // free-text search in title / description
  limit?:   number;
  offset?:  number;
};

export async function getFilteredTickets(opts: TicketFilterOptions = {}) {
  const {
    status,
    type,
    tag,
    query,
    limit  = 50,
    offset = 0,
  } = opts;

  /* ---------- where clause built dynamically ---------------------------- */
  const where: Prisma.TicketWhereInput = {};

  if (status) where.status = status;
  if (type)   where.type   = type;

  if (query) {
    where.OR = [
      { title:       { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { fromName:    { contains: query, mode: 'insensitive' } },
    ];
  }

  if (tag) {
    where.tags = {
      some: { tag: { name: tag } },
    };
  }

  /* ---------- main query ------------------------------------------------ */
  const [tickets, totalTickets] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      include: {
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip:  offset,
      take:  limit,
    }),
    prisma.ticket.count({ where }),
  ]);

  return {
    tickets,
    totalTickets,
    totalPages: Math.max(1, Math.ceil(totalTickets / limit)),
  };
}
