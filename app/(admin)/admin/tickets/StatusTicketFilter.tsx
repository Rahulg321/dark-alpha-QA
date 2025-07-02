"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ticketStatuses } from "@/lib/db/types";

const StatusTicketFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [status, setStatus] = useState("all");

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) {
      setStatus(status);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    startTransition(() => {
      setStatus(value);
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value === "all") {
        params.delete("status");
        params.delete("page");
      } else {
        params.set("status", value);
        params.set("page", "1");
      }
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div data-pending={isPending ? "" : undefined}>
      <Tabs value={status} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="all">All</TabsTrigger>
          {ticketStatuses.map((status) => (
            <TabsTrigger key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default StatusTicketFilter;
