import 'server-only';

import Link from 'next/link';
import { Suspense } from 'react';
import { LayoutGrid, List as ListIcon } from 'lucide-react';

import StatusTicketFilter     from './StatusTicketFilter';
import TicketTypeFilter       from './TicketTypeFilter';
import SearchTicketFilter     from './SearchTicketFilter';
import TicketPaginationFilter from './TicketPaginationFilter';

import TagSearchFilter        from './TagSearchFilter';
import TimelineSidebar        from './TimelineSidebar';
import AdminTicketCard        from './AdminTicketCard';
import AdminTicketRow         from './AdminTicketRow';

import TicketCardSkeleton     from '@/components/skeletons/TicketCardSkeleton';
import { getFilteredTickets } from '@/lib/db/queries/getFilteredTickets';

/* ────────────────────────────────────────────────────────────────────────── */
/* helper to rebuild the QS while overriding a few keys                      */
/* ────────────────────────────────────────────────────────────────────────── */
function buildHref(
  base: URLSearchParams,
  overrides: Record<string, string | undefined>,
) {
  const qs = new URLSearchParams(base);
  Object.entries(overrides).forEach(([k, v]) =>
    v ? qs.set(k, v) : qs.delete(k),
  );
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const metadata = {
  title:       'Support Tickets',
  description: 'Manage website submissions and email-based support requests.',
};

export default async function AdminTickets({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  /* ─ read params once ──────────────────────────────────────────────────── */
  const p          = await searchParams;
  const status     = p.status ?? '';
  const type       = p.type   ?? '';
  const query      = p.query  ?? '';
  const tagParam   = p.tag    ?? '';
  const tagFilters = tagParam ? tagParam.split(',').filter(Boolean) : [];
  const view       = p.view === 'list' ? 'list' : 'card';
  const currentPage= Number(p.page) || 1;
  const limit      = 50;
  const offset     = (currentPage - 1) * limit;

  /* ─ fetch tickets ─────────────────────────────────────────────────────── */
  const { tickets, totalPages } = await getFilteredTickets({
    status,
    type,
    query,
    tags: tagFilters,
    limit,
    offset,
  });

  /* unique tags */
  const uniqueTags = Array.from(
    new Set(tickets.flatMap(t => t.tags.map(tt => tt.tag.name))),
  ).sort();

  /* build timeline dates */
  const dates = Array.from(
    new Set(tickets.map(t => t.createdAt.toISOString().slice(0, 10))),
  ).sort((a, b) => (a < b ? 1 : -1));

  /* base QS for links */
  const baseQS = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (v && k !== 'view') baseQS.set(k, v);
  });

  /* ─────────────────────────────────────────────────────────────────────── */
  /* render                                                                 */
  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">
      <div className="big-container block-space-mini space-y-6">
        {/* headline */}
        <header>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">
            Support Tickets
          </h1>
          <p className="text-muted-foreground">
            Manage website submissions and email-based support requests.
          </p>
        </header>

        {/* top-bar filters + view toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <StatusTicketFilter />
            <TicketTypeFilter   />
            <SearchTicketFilter />
          </div>

          <div className="flex items-center gap-1">
            <Link
              href={buildHref(baseQS, { view: 'card' })}
              replace
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                view === 'card'
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Link>
            <Link
              href={buildHref(baseQS, { view: 'list' })}
              replace
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                view === 'list'
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* tag search */}
        {uniqueTags.length > 0 && <TagSearchFilter tags={uniqueTags} />}

        {/* page header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'} found
          </h2>
          {totalPages > 1 && <TicketPaginationFilter totalPages={totalPages} />}
        </div>

        {/* main layout */}
        <div className="flex">
          {dates.length >= 1 && (
            <TimelineSidebar dates={dates} containerId="tickets-scroll" />
          )}

          <div
            id="tickets-scroll"
            className="grow space-y-8 overflow-y-auto pb-10"
            style={{ maxHeight: 'calc(100vh - 12rem)' }}
          >
            {dates.map(date => {
              const dayTickets = tickets.filter(
                t => t.createdAt.toISOString().slice(0, 10) === date,
              );

              return (
                <section key={date} id={`date-${date}`} data-day={date} className="space-y-4">
                  <h3 className="text-lg font-semibold capitalize tracking-tight">
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month:   'short',
                      day:     'numeric',
                      year:    'numeric',
                    })}
                  </h3>

                  {view === 'card' ? (
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      <Suspense
                        fallback={Array.from({ length: 3 }).map((_, i) => (
                          <TicketCardSkeleton key={i} />
                        ))}
                      >
                        {dayTickets.map(ticket => (
                          <AdminTicketCard
                            key={ticket.id}
                            ticketId={ticket.id}
                            status={ticket.status as 'open' | 'closed'}
                            type={ticket.type as 'email' | 'website'}
                            priority={ticket.priority as 'low' | 'medium' | 'high'}
                            title={ticket.title}
                            description={ticket.description ?? 'No description'}
                            fromName={ticket.fromName ?? 'Unknown'}
                            createdAt={ticket.createdAt}
                            tags={ticket.tags}
                          />
                        ))}
                      </Suspense>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dayTickets.map(ticket => (
                        <AdminTicketRow key={ticket.id} ticket={ticket} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
