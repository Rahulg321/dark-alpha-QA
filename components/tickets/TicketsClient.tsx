'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Ticket as TicketType } from "@/lib/db/schema";

// Extend the ticket type to include reply count
type TicketWithReplyCount = TicketType & {
  _count: {
    replies: number;
  };
};

interface TicketsClientProps {
  tickets: TicketWithReplyCount[];
}

type FilterType = 'all' | 'latest' | 'hot';

export default function TicketsClient({ tickets }: TicketsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('latest');

  // Filter and search tickets
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchLower) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort based on filter
    if (filter === 'latest') {
      filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (filter === 'hot') {
      // Sort by reply count for "hot" topics
      filtered = filtered.sort((a, b) => (b._count?.replies || 0) - (a._count?.replies || 0));
    }

    return filtered;
  }, [tickets, searchTerm, filter]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Decorative blurred radial gradients similar to reference */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute w-[700px] h-[700px] bg-[#0040ff]/10 rounded-full blur-3xl top-[-250px] -left-[350px]" />
        <div className="absolute w-[700px] h-[700px] bg-[#0040ff]/10 rounded-full blur-3xl bottom-[-250px] -right-[350px]" />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-800 bg-black">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-normal text-white mb-4">Dark Alpha Capital Forum</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation and Search */}
        <div className="bg-black border-b border-gray-800 sticky top-0 z-10">
          <div className="px-6 py-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-300 bg-gray-800 px-2 py-1 rounded">Tickets</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Investments</span>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#4f9cf9] focus:ring-1 focus:ring-[#4f9cf9] rounded-lg h-10"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'latest' 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setFilter('latest')}
              >
                ✓ Latest
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'hot' 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setFilter('hot')}
              >
                Hot
              </button>
            </div>
          </div>
        </div>

        {/* Forum Content */}
        <div className="px-6">
          {/* Column Headers */}
          <div className="grid grid-cols-12 gap-4 py-4 text-xs font-medium text-gray-400 border-b border-gray-800">
            <div className="col-span-6">Topic</div>
            <div className="col-span-2 text-center">Replies</div>
            <div className="col-span-2 text-center">Views</div>
            <div className="col-span-2 text-center">Activity</div>
          </div>

          {/* Topics List */}
          <div className="divide-y divide-gray-800">
            {filteredTickets.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-gray-400 mb-4">
                  {searchTerm ? 'No topics found matching your search.' : 'No topics yet.'}
                </div>
                <Link href="/tickets/new">
                  <Button className="bg-[#4f9cf9] text-white hover:bg-[#3b82f6] rounded-lg">
                    Create First Topic
                  </Button>
                </Link>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const replyCount = ticket._count?.replies || 0;
                const viewCount = 0; // Set to 0 for now - to be implemented later
                
                return (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id}`}
                    className="group block transition-colors duration-150"
                  >
                    <div className="grid grid-cols-12 gap-4 py-4 items-center">
                      {/* Topic Column */}
                      <div className="col-span-6">
                        <div className="flex items-start gap-3">
                          {/* Star icon removed as per new design */}
                          <div className="min-w-0 flex-1">
                            <h3 className="text-white group-hover:text-[#4f9cf9] transition-colors font-normal leading-snug">
                              {ticket.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                                {ticket.type}
                              </span>
                              {ticket.description && (
                                <span className="text-xs text-gray-500 truncate max-w-xs">
                                  {ticket.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Replies Column */}
                      <div className="col-span-2 text-center">
                        <div className="text-white font-medium">{replyCount}</div>
                      </div>

                      {/* Views Column */}
                      <div className="col-span-2 text-center">
                        <div className="text-white font-medium">{viewCount}</div>
                      </div>

                      {/* Activity Column */}
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium ${getAvatarColor(ticket.fromName)}`}>
                            {getInitials(ticket.fromName)}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {formatTimeAgo(ticket.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer spacing */}
          <div className="h-16"></div>
        </div>
      </div>
    </div>
  );
}