import { formatDistanceToNow } from "date-fns";
import { Clock, CheckCircle, AlertCircle, Calendar, ArrowRight, Mail, MessageSquare, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "@/lib/db/schema";
import Link from "next/link";

interface TicketRowViewProps {
  ticket: Ticket;
}

export function TicketRowView({ ticket }: TicketRowViewProps) {
  const getStatusIcon = () => {
    switch (ticket.status) {
      case "open":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (ticket.status) {
      case "open":
        return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100";
      case "closed":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100";
    }
  };

  const getTypeIcon = () => {
    switch (ticket.type) {
      case "email":
        return <Mail className="h-3 w-3" />;
      case "website":
        return <MessageSquare className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const truncateDescription = (text: string | null, maxLength: number = 80) => {
    if (!text) return "No description provided";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Link href={`/tickets/${ticket.id}`} className="group">
      <div className="flex items-center justify-between gap-4 rounded-lg border p-4 transition-all duration-200 hover:shadow-md hover:bg-accent/5 group-hover:border-primary/20">
        {/* Left side: status icon, title, description */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon()}
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {ticket.title}
            </h3>
            <Badge variant="outline" className={`${getStatusColor()} font-medium text-xs`}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            {truncateDescription(ticket.description)}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {getTypeIcon()}
              <span className="capitalize">{ticket.type || 'general'}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{ticket.fromName || 'You'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Right side: date and arrow */}
        <div className="flex items-center gap-4 text-right">
          <div className="text-sm text-muted-foreground hidden sm:block">
            <div className="font-medium">
              {formatDate(ticket.createdAt)}
            </div>
          </div>
          <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
            <span className="text-xs font-medium hidden sm:inline">View</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}