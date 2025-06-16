"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Mail, MessageSquare } from "lucide-react";

const TicketTypeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [type, setType] = useState("all");

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      setType(type);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    startTransition(() => {
      setType(value);
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value === "all") {
        params.delete("type");
        params.delete("page");
      } else {
        params.set("type", value);
        params.set("page", "1");
      }
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div data-pending={isPending ? "" : undefined}>
      <Tabs value={type} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="size-3 mr-1 inline" /> Email Tickets
          </TabsTrigger>
          <TabsTrigger value="website">
            <MessageSquare className="size-3 mr-1 inline" /> Website Tickets
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TicketTypeFilter;
