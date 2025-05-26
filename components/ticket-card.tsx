import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Ticket } from "@/lib/db/schema";

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const getStatusIcon = () => {
    switch (ticket.status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (ticket.status) {
      case "open":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "closed":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "";
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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">
              {ticket.id}
            </span>
            <h3 className="font-semibold">{ticket.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={getStatusColor()}>
              <span className="flex items-center gap-1">
                {getStatusIcon()}
                {ticket.status.charAt(0).toUpperCase() +
                  ticket.status.slice(1).replace("-", " ")}
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="font-semibold">From:</span> {ticket.userId}
        </div>
        <p className="text-gray-700">{ticket.description}</p>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 px-4 py-2 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
          <div>Submitted: {formatDate(ticket.createdAt)}</div>
          <div>
            {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
