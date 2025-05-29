import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Send,
  Reply,
  ExternalLink,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TicketDetail({ params }: { params: { id: string } }) {
  // Mock data - in real app this would be fetched based on ID
  const isEmailTicket =
    params.id === "2" || params.id === "4" || params.id === "6";

  const ticket = {
    id: Number.parseInt(params.id),
    title: isEmailTicket
      ? "Re: Account access issues"
      : "Unable to upload files larger than 10MB",
    description: isEmailTicket
      ? "I reset my password yesterday but I'm still unable to log into my account. The system says my credentials are invalid. I've tried multiple browsers and cleared my cache but the issue persists."
      : "I'm trying to upload a PDF file that's 15MB but the system keeps showing an error message. This is blocking my workflow. I've tried multiple times and different browsers but the issue persists. The error message says 'File size exceeds limit' but I thought the limit was 50MB according to your documentation.",
    user: {
      name: isEmailTicket ? "Sarah Wilson" : "John Doe",
      email: isEmailTicket
        ? "sarah.wilson@company.com"
        : "john.doe@example.com",
      company: isEmailTicket ? "Wilson & Associates" : "Tech Solutions Inc.",
    },
    status: "open",
    priority: isEmailTicket ? "medium" : "high",
    category: isEmailTicket ? "Account" : "Technical",
    source: isEmailTicket ? "email" : "website",
    createdAt: isEmailTicket
      ? "December 7, 2023 at 9:15 AM"
      : "December 8, 2023 at 2:30 PM",
    updatedAt: isEmailTicket
      ? "December 7, 2023 at 9:15 AM"
      : "December 8, 2023 at 2:30 PM",
    adminResponse: null,
    // Email-specific fields
    emailSubject: isEmailTicket ? "Re: Account access issues" : null,
    emailFrom: isEmailTicket ? "sarah.wilson@company.com" : null,
    emailTo: isEmailTicket ? "support@yourcompany.com" : null,
    emailThread: isEmailTicket
      ? [
          {
            id: 1,
            from: "sarah.wilson@company.com",
            to: "support@yourcompany.com",
            subject: "Account access issues",
            content:
              "I reset my password yesterday but I'm still unable to log into my account. The system says my credentials are invalid.",
            timestamp: "December 7, 2023 at 9:15 AM",
            isFromUser: true,
          },
        ]
      : null,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "closed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
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
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "website":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-5xl">
        <Link
          href="/admin/tickets"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Link>

        <div className="space-y-6">
          <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(ticket.status)}
                {getSourceIcon(ticket.source)}
                <h1 className="text-2xl font-semibold tracking-tight">
                  {ticket.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{ticket.category}</Badge>
                <Badge variant={getPriorityColor(ticket.priority)}>
                  {ticket.priority} priority
                </Badge>
                <Badge
                  variant={ticket.status === "open" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {ticket.status}
                </Badge>
                <Badge variant="secondary">{ticket.source} ticket</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue={ticket.status}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={ticket.priority}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details">
                {ticket.source === "email" ? "Email Details" : "Ticket Details"}
              </TabsTrigger>
              <TabsTrigger value="response">
                {ticket.source === "email"
                  ? "Email Response"
                  : "Admin Response"}
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  {ticket.source === "email" && ticket.emailThread && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Mail className="h-5 w-5" />
                          Email Thread
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {ticket.emailThread.map((email) => (
                            <div
                              key={email.id}
                              className="border rounded-lg p-4 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      email.isFromUser ? "default" : "secondary"
                                    }
                                  >
                                    {email.isFromUser
                                      ? "From User"
                                      : "From Support"}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {email.timestamp}
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <span className="font-medium">From:</span>{" "}
                                  {email.from}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">To:</span>{" "}
                                  {email.to}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">Subject:</span>{" "}
                                  {email.subject}
                                </div>
                              </div>
                              <div className="pt-2 border-t">
                                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                  {email.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {ticket.source === "website" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          User Message
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {ticket.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
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
                            {ticket.user.name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground font-medium text-sm">
                            Email
                          </dt>
                          <dd>
                            <a
                              href={`mailto:${ticket.user.email}`}
                              className="text-foreground hover:underline inline-flex items-center gap-1"
                            >
                              {ticket.user.email}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground font-medium text-sm">
                            Company
                          </dt>
                          <dd className="text-foreground">
                            {ticket.user.company}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
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
                            {ticket.createdAt}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground font-medium text-sm">
                            Last Updated
                          </dt>
                          <dd className="text-foreground text-sm">
                            {ticket.updatedAt}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="response" className="space-y-6">
              {ticket.adminResponse && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Previous Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed">
                      {ticket.adminResponse}
                    </p>
                  </CardContent>
                </Card>
              )}

              {ticket.source === "email" ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Reply className="h-5 w-5" />
                      Send Email Response
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Compose an email response that will be sent to{" "}
                      {ticket.user.email}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="from">From</Label>
                          <Input
                            id="from"
                            value="support@yourcompany.com"
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="to">To</Label>
                          <Input id="to" value={ticket.user.email} disabled />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          defaultValue={`Re: ${
                            ticket.emailSubject || ticket.title
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emailResponse">Email Message</Label>
                        <Textarea
                          id="emailResponse"
                          placeholder="Type your email response here..."
                          rows={10}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="submit"
                          className="flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Send Email & Close Ticket
                        </Button>
                        <Button type="button" variant="outline">
                          Save Draft
                        </Button>
                        <Button type="button" variant="outline">
                          Send Email Only
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Send Response
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Provide a helpful response to resolve the user&apos;s
                      issue.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="response">Response Message</Label>
                        <Textarea
                          id="response"
                          placeholder="Type your response here..."
                          rows={8}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="submit"
                          className="flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Send Response & Close Ticket
                        </Button>
                        <Button type="button" variant="outline">
                          Save Draft
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ticket History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {ticket.source === "email" ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {ticket.user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {ticket.source === "email"
                              ? "sent an email"
                              : "created this ticket"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {ticket.createdAt}
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
