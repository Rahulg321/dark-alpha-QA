"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Reply, User } from "lucide-react";
import React from "react";

const AdminTicketEmailResponseForm = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Reply className="size-5" />
            Send Email Response
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compose an email response that will be sent to{" "}
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input id="from" value="support@yourcompany.com" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input id="to" value="support@yourcompany.com" disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" defaultValue={`Re: `} />
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
              <Button type="submit" className="flex items-center gap-2">
                <Send className="size-4" />
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
    </div>
  );
};

export default AdminTicketEmailResponseForm;
