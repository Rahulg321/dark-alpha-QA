'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Mail, MessageSquare, Calendar, User } from 'lucide-react';

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
 *   status     : string;
 *   type       : string;
 *   priority   : string;
 *   fromName   : string;
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
  status: string;
  type: string;
  priority: string;
  fromName: string;
  tags: { tagId: number; tag: { id: number; name: string } }[];
};

export default function AdminTicketRow({ ticket }: { ticket: TicketWithTags }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="size-4 text-orange-500" />;
      case 'closed':
        return <CheckCircle className="size-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'email':
        return <Mail className="size-4 text-blue-500" />;
      case 'website':
        return <MessageSquare className="size-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Link
      href={`/admin/tickets/${ticket.id}`}
      className="flex items-start justify-between gap-4 rounded-md border p-4"
    >
      {/* Left side: status icon, title, description, tags */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          {getStatusIcon(ticket.status)}
          <h3 className="font-medium truncate">{ticket.title}</h3>
          <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
            {ticket.priority}
          </Badge>
        </div>
        
        <p className="line-clamp-1 text-sm text-muted-foreground mb-2">
          {ticket.description ?? 'No description'}
        </p>
        
        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {ticket.tags.map(tt => (
              <Badge key={tt.tagId} variant="outline" className="text-xs">
                {tt.tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Right side: type badge, user, date */}
      <div className="flex flex-col items-end gap-2 text-xs">
        <Badge variant="outline" className="flex items-center gap-1 text-xs">
          {getSourceIcon(ticket.type)}
          <span>{ticket.type}</span>
        </Badge>
        
        <div className="flex items-center gap-1 text-muted-foreground">
          <User className="size-3" />
          <span>{ticket.fromName}</span>
        </div>
        
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="size-3" />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
