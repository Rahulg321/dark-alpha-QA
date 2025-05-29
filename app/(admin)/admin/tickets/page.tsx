import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminTickets() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Support Tickets
          </h1>
          <p className="text-muted-foreground">
            Manage website submissions and email-based support requests.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              Open
            </Button>
            <Button variant="ghost" size="sm">
              Closed
            </Button>
            <Button variant="ghost" size="sm">
              All
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="h-3 w-3 mr-1" />
              Email Tickets
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-3 w-3 mr-1" />
              Website Tickets
            </Button>
            <Button variant="outline" size="sm">
              High Priority
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <TicketCards />
        </div>
      </div>
    </div>
  );
}

function TicketCards() {
  const tickets = [
    {
      id: 1,
      title: "Unable to upload files larger than 10MB",
      description:
        "I'm trying to upload a PDF file that's 15MB but the system keeps showing an error message. This is blocking my workflow.",
      user: "john.doe@example.com",
      status: "open",
      priority: "high",
      category: "Technical",
      source: "website",
      createdAt: "Dec 8, 2023",
      updatedAt: "Dec 8, 2023",
    },
    {
      id: 2,
      title: "Re: Account access issues",
      description:
        "I reset my password yesterday but I'm still unable to log into my account. The system says my credentials are invalid.",
      user: "sarah.wilson@company.com",
      status: "open",
      priority: "medium",
      category: "Account",
      source: "email",
      emailSubject: "Re: Account access issues",
      createdAt: "Dec 7, 2023",
      updatedAt: "Dec 7, 2023",
    },
    {
      id: 3,
      title: "Feature request: Dark mode support",
      description:
        "Would it be possible to add dark mode support to the application? It would greatly improve the user experience.",
      user: "mike.chen@startup.io",
      status: "closed",
      priority: "low",
      category: "Feature Request",
      source: "website",
      createdAt: "Dec 5, 2023",
      updatedAt: "Dec 6, 2023",
    },
    {
      id: 4,
      title: "API documentation inquiry",
      description:
        "The API documentation shows endpoints that no longer exist and missing information about new authentication methods.",
      user: "dev@techcorp.com",
      status: "open",
      priority: "medium",
      category: "Documentation",
      source: "email",
      emailSubject: "API documentation inquiry",
      createdAt: "Dec 4, 2023",
      updatedAt: "Dec 4, 2023",
    },
    {
      id: 5,
      title: "Billing discrepancy in monthly invoice",
      description:
        "My invoice shows charges for features I haven't used. Could you please review and correct the billing?",
      user: "finance@business.com",
      status: "open",
      priority: "high",
      category: "Billing",
      source: "website",
      createdAt: "Dec 3, 2023",
      updatedAt: "Dec 3, 2023",
    },
    {
      id: 6,
      title: "Integration setup help needed",
      description:
        "The integration with our CRM system stopped working after the recent update. Getting 401 authentication errors.",
      user: "admin@enterprise.org",
      status: "closed",
      priority: "high",
      category: "Integration",
      source: "email",
      emailSubject: "Integration setup help needed",
      createdAt: "Dec 1, 2023",
      updatedAt: "Dec 2, 2023",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "website":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <>
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="group hover:shadow-md transition-all duration-200 border-border"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                {getSourceIcon(ticket.source)}
                <Badge variant="outline" className="text-xs">
                  {ticket.category}
                </Badge>
                <Badge
                  variant={getPriorityColor(ticket.priority)}
                  className="text-xs"
                >
                  {ticket.priority}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Mark as {ticket.status === "open" ? "Closed" : "Open"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Change Priority</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link href={`/admin/tickets/${ticket.id}`} className="block group">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg group-hover:text-foreground/80 transition-colors line-clamp-1 flex-1">
                  {ticket.title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {ticket.source}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                {ticket.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate">{ticket.user}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{ticket.createdAt}</span>
                  </div>
                  <span className="capitalize">{ticket.status}</span>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
