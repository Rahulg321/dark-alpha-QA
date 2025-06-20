import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar } from 'lucide-react';

interface Ticket {
  tags: string[];
  title: string;
  body: string;
  author: string;
  createdAt: string | number | Date;
  status: string;
}

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex gap-2">
          {ticket.tags.map((tag: string) => (
            <Badge key={tag} className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="line-clamp-1">{ticket.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground">
        <p className="line-clamp-2">{ticket.body}</p>

        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {ticket.author}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {new Date(ticket.createdAt).toLocaleString()}
        </div>
        <span className="font-medium capitalize">{ticket.status}</span>
      </CardContent>
    </Card>
  );
}
