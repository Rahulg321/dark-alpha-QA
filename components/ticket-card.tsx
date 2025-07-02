import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle, Clock, Calendar, ArrowRight, Mail, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Ticket } from "@/lib/db/schema";
import Link from "next/link";

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const getStatusIcon = () => {
    switch (ticket.status) {
      case "open":
        return <Clock className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
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

  const getCardBorderColor = () => {
    switch (ticket.status) {
      case "open":
        return "border-l-orange-400";
      case "closed":
        return "border-l-green-400";
      default:
        return "border-l-gray-400";
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

  const truncateDescription = (text: string | null, maxLength: number = 120) => {
    if (!text) return "No description provided";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Link href={`/tickets/${ticket.id}`} className="group">
      <Card className={`overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-l-4 ${getCardBorderColor()} group-hover:border-primary/20`}>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                {ticket.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {getTypeIcon()}
                <span className="capitalize">{ticket.type || 'general'}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" />
                <span>{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getStatusColor()} font-medium`}>
                <span className="flex items-center gap-1.5">
                  {getStatusIcon()}
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-5 pt-0">
          <p className="text-muted-foreground leading-relaxed">
            {truncateDescription(ticket.description)}
          </p>
        </CardContent>
        
        <CardFooter className="border-t bg-gradient-to-r from-muted/30 to-muted/10 px-5 py-3">
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(ticket.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
              <span className="text-xs font-medium">View Details</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
