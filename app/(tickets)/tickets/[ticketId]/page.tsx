import React from "react";
import { getTicketById } from "@/lib/db/queries/getTicketById";
import { getRelatedTickets } from "@/lib/db/queries/getRelatedTickets";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, MessageSquare, User, Mail, Clock, Tag, Heart, Pencil, Paperclip } from "lucide-react";
import Link from "next/link";
import TicketDetailSidebar from "@/components/tickets/TicketDetailSidebar";
import EditorField from "@/components/EditorField";

const SpecificTicketPage = async ({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) => {
  const { ticketId } = await params;
  
  const ticket = await getTicketById({ id: ticketId });
  const relatedTickets = await getRelatedTickets(ticketId, 5);

  // Create server action for this specific ticket
  async function handleAddReply(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    console.log('Form submission:', { name, email, message, ticketId });

    if (!name || !email || !message) {
      throw new Error('All fields are required');
    }

    const reply = await prisma.reply.create({
      data: {
        ticketId,
        body: message,
        fromName: name,
        fromEmail: email,
        isAdmin: false,
      },
    });

    console.log('Reply created successfully:', reply);
    revalidatePath(`/tickets/${ticketId}`);
    redirect(`/tickets/${ticketId}`);
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background">
        <div className="block-space big-container">
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ticket not found</h3>
                <p className="text-muted-foreground">The ticket you're looking for doesn't exist.</p>
              </div>
              <Button asChild>
                <Link href="/tickets">Back to Tickets</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Group all messages by date for timeline functionality
  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  
  // Collect all dates and group content by date
  const allContent = [
    { type: 'original', date: ticket.createdAt, content: ticket },
    ...(ticket.replies?.map(reply => ({ type: 'reply', date: reply.createdAt, content: reply })) || [])
  ];

  // Group by date
  const contentByDate = allContent.reduce((acc, item) => {
    const date = dayKey(item.date);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Get unique dates sorted chronologically
  const uniqueDates = Object.keys(contentByDate).sort();
  
  // Define sections for the sidebar with date-based navigation
  const sections = [
    ...uniqueDates.map(date => ({
      id: `date-${date}`,
      label: new Date(date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      type: 'date' as const,
    })),
    { id: 'reply-form', label: 'Add Reply', type: 'form' as const },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <TicketDetailSidebar sections={sections} />
        
        <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="hover:bg-accent">
            <Link href="/tickets" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              ← Back to Tickets
            </Link>
          </Button>
        </div>

        {/* Ticket Header */}
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full mt-1 ${
              ticket.status === 'open' ? 'bg-orange-500' : 'bg-green-500'
            }`} />
            <h1 className="text-2xl font-bold text-foreground">{ticket.title}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm mb-4">
            <Badge variant="outline" className="text-xs">
              {ticket.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {ticket.priority}
            </Badge>
            {ticket.tags && ticket.tags.map((ticketTag) => (
              <Badge key={ticketTag.tagId} variant="outline" className="text-xs">
                {ticketTag.tag.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Main Content - Organized by Date but without visible headers */}
        <div className="space-y-4">
          {uniqueDates.map(date => (
            <section key={date} id={`date-${date}`} className="scroll-mt-8">
              <div className="space-y-6">
                {contentByDate[date].map((item, index) => (
                  <div
                    key={`${item.type}-${index}`}
                    className={`py-4 ${
                      index === 0 && item.type === 'original' ? '' : 'border-t border-[#333]'
                    }`}
                  >
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className={
                          item.type === 'original'
                            ? 'bg-gray-700 text-white text-sm font-semibold'
                            : 'bg-gray-600 text-white text-sm font-medium'
                        }>
                          {getInitials(item.content.fromName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-3 mb-1">
                          <span className="font-medium text-white">{item.content.fromName}</span>
                          {item.type === 'original' && (
                            <span className="text-[11px] uppercase tracking-wide bg-gray-700 text-gray-300 px-2 py-0.5 rounded">Author</span>
                          )}
                          {item.type === 'reply' && item.content.isAdmin && (
                            <span className="text-[11px] uppercase tracking-wide bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Admin</span>
                          )}
                          <span className="text-sm text-gray-400">
                            {formatDate(item.date)}
                          </span>
                        </div>
                        <div className="prose dark:prose-invert text-gray-200 max-w-none text-sm leading-relaxed">
                          {item.type === 'original' ? (
                            <p className="whitespace-pre-wrap">{item.content.description}</p>
                          ) : (
                            <div dangerouslySetInnerHTML={{ __html: item.content.body }} />
                          )}
                        </div>
                        {/* Action buttons */}
                        <div className="flex items-center gap-6 mt-3 text-gray-500">
                          <button className="hover:text-[#4f9cf9] flex items-center" title="Like">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button className="hover:text-[#4f9cf9] flex items-center" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <label className="hover:text-[#4f9cf9] flex items-center cursor-pointer" title="Attach file">
                            <Paperclip className="h-4 w-4" />
                            <input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

          {/* Reply Form */}
          <section id="reply-form" className="border-t border-border pt-8 mt-8 scroll-mt-8">
            <div className="bg-muted/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Add a Reply
              </h3>
              <form action={handleAddReply} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Your Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="h-11"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">
                    Your Reply
                  </label>
                  <EditorField name="message" placeholder="Type your reply here..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" size="lg" className="flex items-center gap-2 px-6">
                    <MessageSquare className="h-4 w-4" />
                    Post Reply
                  </Button>
                  <Button type="reset" variant="outline" size="lg" className="px-6">
                    Clear
                  </Button>
                </div>
              </form>
            </div>
          </section>

          {/* Related Topics Section removed as per new requirements */}
        </div>
      </div>
    </>
  );
};

export default SpecificTicketPage;
