import prisma from '@/lib/prisma';

/**
 * Returns one ticket together with
 *   – its tags (array of { tagId, tag: { id, name } })
 *   –   any other relations you need (comments, activity, …)
 */
export async function getTicketById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } }, // 👈 relation, not scalar column!
    },
  });
}
