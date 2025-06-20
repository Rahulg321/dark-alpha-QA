import { Badge } from '@/components/ui/badge';

type Ticket = {
  title: string;
  tags: string[];
  createdAt: string | number | Date;
  status: string;
};

export default function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <div className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm hover:bg-accent">
      <div className="col-span-4 font-medium truncate">{ticket.title}</div>

      <div className="col-span-3 flex flex-wrap gap-1">
        {ticket.tags.map(t => (
          <Badge key={t} className="capitalize">
            {t}
          </Badge>
        ))}
      </div>

      <div className="col-span-2 whitespace-nowrap">
        {new Date(ticket.createdAt).toLocaleDateString()}
      </div>

      <div className="col-span-2 capitalize">{ticket.status}</div>
    </div>
  );
}
