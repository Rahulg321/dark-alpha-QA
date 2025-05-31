"use client"

import { formatDistanceToNow } from "date-fns"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Reply } from "@/lib/db/schema"
import Link from "next/link";

interface ReplyCardProps {
  reply: Reply
}

export function ReplyCard({ reply }: ReplyCardProps) {

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
    <CardHeader className="p-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
    <div className="flex items-center gap-2">
    <span className="font-mono text-sm text-muted-foreground">{reply.id}</span>
    </div>
    </div>
    </CardHeader>
    <CardContent className="p-4">
    <div className="mb-2">
    <span className="font-semibold">From:</span> {reply.userId}
    </div>
    <p className="text-gray-700">{reply.content}</p>
    </CardContent>
    <CardFooter className="border-t bg-gray-50 px-4 py-2 text-sm text-muted-foreground">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
    <div>Submitted: {formatDate(reply.createdAt)}</div>
    <div>{formatDistanceToNow(reply.createdAt, { addSuffix: true })}</div>
    </div>
    </CardFooter>
    </Card>
  )
}
