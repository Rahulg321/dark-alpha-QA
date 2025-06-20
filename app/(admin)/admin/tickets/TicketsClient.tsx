'use client';

import { useState, useMemo } from 'react';
import TagFilter     from '@/components/tickets/TagFilter';
import ViewToggle    from '@/components/tickets/ViewToggle';
import TicketCard    from '@/components/tickets/TicketCard';
import TicketRow     from '@/components/tickets/TicketRow';

type Ticket = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  status: 'open' | 'closed';
  tags: string[];                   // ← must be present on each ticket
  author: string;
};

export default function TicketsClient({
  initialTickets,
}: {
  initialTickets: Ticket[];
}) {
  const [view, setView]       = useState<'card' | 'list'>('card');
  const [tag,  setTag]        = useState<string | null>(null);

  const tickets = useMemo(
    () => (tag ? initialTickets.filter(t => t.tags.includes(tag)) : initialTickets),
    [initialTickets, tag]
  );

  return (
    <section className="space-y-5">
      {/* header ----------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TagFilter tickets={initialTickets} activeTag={tag} onChange={setTag} />
        <ViewToggle value={view} onChange={setView} />
      </div>

      {/* data ------------------------------------------------------------- */}
      {tickets.length === 0 ? (
        <p className="text-muted-foreground italic">No tickets match that tag.</p>
      ) : view === 'card' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map(t => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      ) : (
        <div className="divide-y rounded-md border">
          {tickets.map(t => (
            <TicketRow key={t.id} ticket={t} />
          ))}
        </div>
      )}
    </section>
  );
}
