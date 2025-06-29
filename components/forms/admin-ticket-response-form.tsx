"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Reply } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ticketReplySchema,
  TicketReply,
} from "@/lib/schemas/ticket-reply-schema";
import { sendTicketReply } from "@/lib/actions/add-ticket-reply";
import { toast } from "@/components/toast";
import { SubmitButton } from "../submit-button";
import { z } from "zod";

const AdminTicketResponseForm = ({ ticketId }: { ticketId: string }) => {
  const router = useRouter();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ticketReplySchema>>({
    resolver: zodResolver(ticketReplySchema),
    defaultValues: {
      subject: "Re: ",
      content: "",
      ticketId: ticketId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ticketReplySchema>) => {
    // Prepare FormData for server action
    const formData = new FormData();
    formData.append("subject", values.subject);
    formData.append("content", values.content);
    formData.append("ticketId", ticketId);

    startTransition(async () => {
      const result = await sendTicketReply({ status: "idle" }, formData);

      if (result.status === "failed") {
        toast({
          type: "error",
          description: "Invalid credentials!",
        });
      } else if (result.status === "invalid_data") {
        toast({
          type: "error",
          description: "Failed validating your submission!",
        });
      } else if (result.status === "user_not_found") {
        toast({
          type: "error",
          description: "User not found! Please login again.",
        });
      } else if (result.status === "invalid_method") {
        toast({
          type: "error",
          description: "Invalid method!",
        });
      } else if (result.status === "success") {
        setIsSuccessful(true);
        toast({
          type: "success",
          description: "Reply sent successfully!",
        });
        setIsSuccessful(false);
        form.reset({ subject: "Re: ", content: "", ticketId });
        router.refresh();
      }
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Reply className="size-5" />
            Send Reply
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compose a reply that will be added to the ticket
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reply</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your reply here..."
                        rows={10}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Hidden ticketId field for completeness, not user-editable */}
              <input
                type="hidden"
                value={ticketId}
                {...form.register("ticketId")}
              />

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={isPending}>
                  <Send className="size-4" />
                  Sending Reply
                </Button>
                <Button type="button" variant="outline" disabled>
                  Save Draft
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTicketResponseForm;
