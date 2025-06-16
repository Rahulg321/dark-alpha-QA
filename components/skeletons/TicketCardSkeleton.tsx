import React from "react";
import { Skeleton } from "../ui/skeleton";

const TicketCardSkeleton = () => {
  return (
    <div className="border rounded-xl p-4 w-full max-w-sm bg-background shadow flex flex-col gap-3">
      {/* Top tags */}
      <div className="flex gap-2 mb-2">
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-6 w-16" />
      </div>
      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-1" />
      {/* Email badge */}
      <div className="flex justify-end mb-2">
        <Skeleton className="h-6 w-12" />
      </div>
      {/* Description */}
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-1" />
      {/* User info and date */}
      <div className="flex items-center gap-2 mt-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32 ml-auto" />
      </div>
      {/* Status */}
      <div className="flex justify-end mt-2">
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  );
};

export default TicketCardSkeleton;
