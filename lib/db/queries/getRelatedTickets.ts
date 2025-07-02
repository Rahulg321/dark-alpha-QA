import prisma from '@/lib/prisma';

/**
 * Get related tickets (recent tickets excluding the current one)
 */
export async function getRelatedTickets(currentTicketId: string, limit: number = 5) {
  return prisma.ticket.findMany({
    where: {
      id: {
        not: currentTicketId
      }
    },
    include: {
      replies: true,
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  });
}