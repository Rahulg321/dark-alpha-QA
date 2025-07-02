import prisma from '@/lib/prisma';
import { v4 as uuid } from 'uuid';

export type NewTicketInput = {
  title:       string;
  description: string;
  priority:    'low' | 'medium' | 'high';
  type:        'email' | 'website';
  fromName:    string;
  tags:        string[];
  createdBy?:  string;      // optional
};

export async function createTicket(data: NewTicketInput) {
  return prisma.ticket.create({
    data: {
      id: uuid(),                       // delete this line if id is Int autoincr
      status:   'open',
      title:       data.title,
      description: data.description,
      priority:    data.priority,
      type:        data.type,
      fromName:    data.fromName,
      createdBy:   data.createdBy,
      fromEmail: 'unknown@example.com',

      tags: data.tags.length
        ? {
            create: data.tags.map((name) => ({
              tag: {
                connectOrCreate: {
                  where:  { name },
                  create: { name },
                },
              },
            })),
          }
        : undefined,
    },
  });
}
