'use server';

import { randomUUID } from 'node:crypto';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Mail,
  MessageSquare,
  User,
  LayoutList,
  Send,
} from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
} from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import TimelineSidebar from './TimelineSidebar';           // ⬅︎ NEW
import { db } from '@/lib/db/client';
import { ticket, ticketTag, tag, reply } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import EditorField from '@/components/EditorField';

/* ------------------------------------------------------------------ */
/* little helpers                                                      */
/* ------------------------------------------------------------------ */
const statusIcon = (s: 'open' | 'closed') =>
  s === 'open' ? (
    <AlertCircle className="size-5 text-orange-500" />
  ) : (
    <CheckCircle className="size-5 text-green-500" />
  );

const sourceIcon = (t: 'email' | 'website') =>
  t === 'email' ? (
    <Mail className="size-5 text-blue-500" />
  ) : (
    <MessageSquare className="size-5 text-green-500" />
  );

const priorityColor = (
  p: 'low' | 'medium' | 'high'
): 'secondary' | 'default' | 'destructive' =>
  ({ low: 'secondary', medium: 'default', high: 'destructive' }[
    p
  ] as 'secondary' | 'default' | 'destructive');

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

/* ------------------------------------------------------------------ */
/* server-action: add a reply                                          */
/* ------------------------------------------------------------------ */
export async function addReply(formData: FormData) {
  'use server';

  const ticketId = String(formData.get('ticketId'));
  const body = String(formData.get('body') ?? '').trim();

  if (!body) redirect(`/admin/tickets/${ticketId}`);

  await prisma.reply.create({
    data: {
      ticketId,
      body,
      fromName: 'Admin',
      fromEmail: 'support@example.com',
      isAdmin: true,
    },
  });

  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath(`/tickets/${ticketId}`);
  redirect(`/admin/tickets/${ticketId}`);
}

/* ====================================================================== */
/* PAGE                                                                   */
/* ====================================================================== */
export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /* ---- 1. the ticket ------------------------------------------------- */
  const [t] = await db.select().from(ticket).where(eq(ticket.id, id));
  if (!t) notFound();

  /* ---- 2. its tags --------------------------------------------------- */
  const tTags = await db
    .select({ name: tag.name })
    .from(ticketTag)
    .innerJoin(tag, eq(ticketTag.tagId, tag.id))
    .where(eq(ticketTag.ticketId, id));

  /* ---- 3. its replies ------------------------------------------------ */
  const tReplies = await prisma.reply.findMany({
    where: { ticketId: id },
    orderBy: { createdAt: 'asc' }
  });

  const hydrated = {
    ...t,
    tags: tTags.map((r) => r.name),
    replies: tReplies,
  };

  /* ---- dates for sidebar / anchor ids -------------------------------- */
  const dates = Array.from(
    new Set([hydrated.createdAt, ...hydrated.replies.map((r) => r.createdAt)].map(dayKey))
  );

  /* ==================================================================== */
  /* render                                                               */
  /* ==================================================================== */
  return (
    <div className="min-h-screen bg-background">
      <div className="big-container block-space-mini space-y-6">
        {/* back link */}
        <Link href="/admin/tickets" className="inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to Tickets
        </Link>

        {/* headline */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {statusIcon(hydrated.status as any)}
              {sourceIcon(hydrated.type as any)}
              <h1 className="text-2xl font-semibold tracking-tight">{hydrated.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hydrated.tags.map((tg) => (
                <Badge key={tg} variant="outline">
                  {tg}
                </Badge>
              ))}
              <Badge variant={priorityColor(hydrated.priority as any)}>
                {hydrated.priority} priority
              </Badge>
              <Badge
                className="capitalize"
                variant={hydrated.status === 'open' ? 'default' : 'secondary'}
              >
                {hydrated.status}
              </Badge>
            </div>
          </div>

          {/* (future) status / priority selectors */}
          <div className="flex gap-2">
            <Select defaultValue={hydrated.status}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue={hydrated.priority}>
              <SelectTrigger className="w-28">
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

        {/* Timeline sidebar - now positioned fixed on the right */}
        {dates.length >= 1 && <TimelineSidebar dates={dates} />}

        {/* main column - full width since sidebar is now fixed */}
        <div className="w-full">
          <main className="max-w-4xl mx-auto space-y-6">
            {/* description */}
            {hydrated.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="size-5" /> User Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {hydrated.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* user details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="size-5" /> User Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  <strong>Name:</strong> {hydrated.fromName}
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a className="underline" href={`mailto:${hydrated.fromEmail}`}>
                    {hydrated.fromEmail}
                  </a>
                </p>
                <p>
                  <strong>Created:</strong>{' '}
                  {new Date(hydrated.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* replies grouped by day */}
            {dates.map((d) => {
              const items = hydrated.replies.filter(
                (r) => dayKey(r.createdAt as any) === d
              );
              if (!items.length) return null;

              return (
                <section key={d} id={`day-${d}`} data-day={d} className="space-y-4">
                  <h2 className="text-lg font-semibold">
                    {new Date(d).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h2>

                  <div className="space-y-2">
                    {items.map((reply) => (
                      <Card key={reply.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {reply.isAdmin ? (
                              <>
                                <LayoutList className="size-5 text-blue-500" /> Admin Reply
                              </>
                            ) : (
                              <>
                                <User className="size-5 text-green-500" /> User Reply
                              </>
                            )}
                            <span className="ml-auto text-sm font-normal text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleTimeString()}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: reply.body }} />
                          <div className="mt-2 text-xs text-muted-foreground">
                            From: {reply.fromName} ({reply.fromEmail})
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* add-reply form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Send className="size-5" /> Add a Reply
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form action={addReply} className="space-y-4">
                  <input type="hidden" name="ticketId" value={hydrated.id} />
                  <div className="space-y-2">
                    <Label htmlFor="body">Message</Label>
                    <EditorField name="body" placeholder="Type your reply here..." />
                  </div>
                  <Button type="submit" className="flex items-center gap-2">
                    <Send className="size-4" /> Send Reply
                  </Button>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
