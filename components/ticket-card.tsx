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
import Link from "next/link";

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const getStatusProps = () => {
    switch (ticket.status) {
      case "open":
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: "Open",
          className:
            "text-blue-800 bg-blue-100 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-900",
        };
      case "closed":
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: "Closed",
          className:
            "text-green-800 bg-green-100 hover:bg-green-100 dark:text-green-300 dark:bg-green-900",
        };
    }
  };

  const statusProps = getStatusProps();

  return (
    <Link href={`/tickets/${ticket.id}`} className="block h-full">
      <Card className="flex flex-col h-full transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-semibold text-base line-clamp-2">
              {ticket.title}
            </h3>
            <Badge
              variant="secondary"
              className={`shrink-0 ${statusProps.className}`}
            >
              <div className="flex items-center gap-1.5">
                {statusProps.icon}
                <span className="font-medium text-xs">{statusProps.text}</span>
              </div>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {ticket.description}
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(ticket.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
