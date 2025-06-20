import 'server-only';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Calendar,
  User,
  Reply,
  Send,
  ExternalLink,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge }   from '@/components/ui/badge';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { Label }   from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import prisma from '@/lib/prisma';

/* ------------------------------------------------------------------------ */
/* helper to fetch ONE ticket with its relation-tags                        */
/* ------------------------------------------------------------------------ */
async function getTicketById(id: string) {
  return prisma.ticket.findUnique({
    where:   { id },
    include: { tags: { include: { tag: true } } },
  });
}

/* ------------------------------------------------------------------------ */
/* icon helpers                                                             */
/* ------------------------------------------------------------------------ */
function StatusIcon({ status }: { status: 'open' | 'closed' }) {
  if (status === 'open')
    return <AlertCircle className="size-5 text-orange-500" />;
  if (status === 'closed')
    return <CheckCircle className="size-5 text-green-500" />;
  return <Clock className="size-5 text-muted-foreground" />;
}
function SourceIcon({ type }: { type: 'email' | 'website' }) {
  return type === 'email' ? (
    <Mail className="size-5 text-blue-500" />
  ) : (
    <MessageSquare className="size-5 text-green-500" />
  );
}
function priorityVariant(p: 'low' | 'medium' | 'high') {
  return p === 'high' ? 'destructive' : p === 'medium' ? 'default' : 'secondary';
}

/* ======================================================================== */
/* PAGE                                                                     */
/* ======================================================================== */
export default async function TicketDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const ticket = await getTicketById(id);
  if (!ticket) notFound();                         // 404 if not found

  return (
    <div className="min-h-screen bg-background">
      <div className="big-container block-space-mini space-y-6">
        {/* back link ------------------------------------------------------- */}
        <Link
          href="/admin/tickets"
          className="mb-6 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back&nbsp;to&nbsp;Tickets
        </Link>

        {/* header ---------------------------------------------------------- */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <StatusIcon status={ticket.status as any} />
              <SourceIcon type={ticket.type as any} />
              <h1 className="text-2xl font-semibold tracking-tight">
                {ticket.title}
              </h1>
            </div>

            {/* tags / priority / status */}
            <div className="flex flex-wrap items-center gap-2">
              {ticket.tags.map(tt => (
                <Badge key={tt.tagId} variant="outline">
                  {tt.tag.name}
                </Badge>
              ))}

              <Badge variant={priorityVariant(ticket.priority as any)}>
                {ticket.priority} priority
              </Badge>

              <Badge
                className="capitalize"
                variant={ticket.status === 'open' ? 'default' : 'secondary'}
              >
                {ticket.status}
              </Badge>
            </div>
          </div>

          {/* status / priority selectors */}
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

        {/* tabs ------------------------------------------------------------- */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details">
              {ticket.type === 'email' ? 'Email Response' : 'Admin Response'}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* ---------------- DETAILS tab ---------------------------------- */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* left 2/3 --------------------------------------------------- */}
              <div className="space-y-4 md:col-span-2">
                {ticket.type === 'website' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="size-5" />
                        User&nbsp;Message
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                        {ticket.description}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* right sidebar --------------------------------------------- */}
              <div className="space-y-4">
                {/* user details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="size-5" />
                      User&nbsp;Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="font-medium text-muted-foreground">
                          Name
                        </dt>
                        <dd>{ticket.fromName}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">
                          Email
                        </dt>
                        <dd>
                          <a
                            href={`mailto:${ticket.fromEmail}`}
                            className="inline-flex items-center gap-1 hover:underline"
                          >
                            {ticket.fromEmail}
                            <ExternalLink className="size-3" />
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                {/* timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="size-5" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="font-medium text-muted-foreground">
                          Created
                        </dt>
                        <dd>{ticket.createdAt.toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">
                          Last&nbsp;Updated
                        </dt>
                        <dd>{ticket.createdAt.toLocaleString()}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ---------------- HISTORY tab ---------------------------------- */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket&nbsp;History</CardTitle>
              </CardHeader>
              <CardContent>
                {/* stub – replace with real events when available */}
                <div className="flex items-start gap-3 border-b pb-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                    {ticket.type === 'email' ? (
                      <Mail className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-medium">{ticket.fromName}</span>
                      <span className="text-xs text-muted-foreground">
                        {ticket.type === 'email'
                          ? 'sent an email'
                          : 'created this ticket'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {ticket.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
