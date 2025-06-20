'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

/**
 * Shape returned by `getFilteredTickets`
 * ───────────────────────────────────────
 * Ticket & related tags, already eager-loaded:
 *
 * {
 *   id         : string;
 *   title      : string;
 *   description: string | null;
 *   createdAt  : Date;
 *   tags       : {
 *     tagId : number;
 *     tag   : { id: number; name: string };
 *   }[];
 * }
 */
export type TicketWithTags = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  tags: { tagId: number; tag: { id: number; name: string } }[];
};

export default function AdminTicketRow({ ticket }: { ticket: TicketWithTags }) {
  return (
    <Link
      href={`/admin/tickets/${ticket.id}`}
      className="flex items-start justify-between gap-4 rounded-md border p-4 hover:bg-accent"
    >
      {/* title + description ------------------------------------------------ */}
      <div className="min-w-0">
        <h3 className="truncate font-medium">{ticket.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {ticket.description ?? 'No description'}
        </p>
      </div>

      {/* tags + date -------------------------------------------------------- */}
      <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
        <div className="flex flex-wrap justify-end gap-1">
          {ticket.tags.map(tt => (
            <Badge key={tt.tagId}>{tt.tag.name}</Badge>
          ))}
        </div>
        <span>{ticket.createdAt.toLocaleString()}</span>
      </div>
    </Link>
  );
}
