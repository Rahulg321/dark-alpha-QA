import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { db } from "@/lib/db/queries";
import { ticket } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AdminTicketEmailResponseForm from "@/components/forms/admin-ticket-email-response-form";
import AdminTicketResponseForm from "@/components/forms/admin-ticket-response-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [userTicket] = await db.select().from(ticket).where(eq(ticket.id, id));

  return {
    title: `Ticket ${userTicket.title}`,
    description: `Ticket ${userTicket.title} with tags ${userTicket.tags?.join(", ")}`,
  };
}

export default async function TicketDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [userTicket] = await db.select().from(ticket).where(eq(ticket.id, id));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="size-5 text-orange-500" />;
      case "closed":
        return <CheckCircle className="size-5 text-green-500" />;
      default:
        return <Clock className="size-5 text-muted-foreground" />;
    }
  };

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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email":
        return <Mail className="size-5 text-blue-500" />;
      case "website":
        return <MessageSquare className="size-5 text-green-500" />;
      default:
        return <MessageSquare className="size-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="big-container block-space-mini">
        <Link
          href="/admin/tickets"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Tickets
        </Link>

        <div className="space-y-6">
          <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(userTicket.status)}
                {getSourceIcon(userTicket.type)}
                <h1 className="text-2xl font-semibold tracking-tight">
                  {userTicket.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {userTicket.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
                <Badge variant={getPriorityColor(userTicket.priority)}>
                  {userTicket.priority} priority
                </Badge>
                <Badge
                  variant={
                    userTicket.status === "open" ? "default" : "secondary"
                  }
                  className="capitalize"
                >
                  {userTicket.status}
                </Badge>
              </div>
            </div>
          </header>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reply">Reply</TabsTrigger>
              <TabsTrigger value="email-response">Email Response</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  {userTicket.type === "website" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageSquare className="size-5" />
                          User Query
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {userTicket.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="size-5" />
                        User Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-muted-foreground font-medium text-sm">
                            Name
                          </dt>
                          <dd className="text-foreground">
                            {userTicket.fromName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground font-medium text-sm">
                            Email
                          </dt>
                          <dd>
                            <a
                              href={`mailto:${userTicket.fromEmail}`}
                              className="text-foreground hover:underline inline-flex items-center gap-1"
                            >
                              {userTicket.fromEmail}
                              <ExternalLink className="size-3" />
                            </a>
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="size-5" />
                        Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-muted-foreground font-medium text-sm">
                            Created
                          </dt>
                          <dd className="text-foreground text-sm">
                            {userTicket.createdAt.toLocaleString()}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground font-medium text-sm">
                            Last Updated
                          </dt>
                          <dd className="text-foreground text-sm">
                            {userTicket.createdAt.toLocaleString()}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reply" className="space-y-6">
              <AdminTicketResponseForm ticketId={id} />
            </TabsContent>

            <TabsContent value="email-response" className="space-y-6">
              <AdminTicketEmailResponseForm />
            </TabsContent>

            <TabsContent value="drafts" className="space-y-6">
              <h2>Drafts</h2>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ticket History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                        {userTicket.type === "email" ? (
                          <Mail className="size-4" />
                        ) : (
                          <User className="size-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {userTicket.fromName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {userTicket.type === "email"
                              ? "sent an email"
                              : "created this ticket"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {userTicket.createdAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
