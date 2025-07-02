import prisma from '@/lib/prisma';

/**
 * Returns one ticket together with its tags and replies
 */
export async function getTicketById({ id }: { id: string }) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      replies: {
        orderBy: { createdAt: 'asc' }
      }
    },
  });

  return ticket;
}
