'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TicketScrollBarProps {
  dates: string[];
  containerId: string;
  ticketCounts: Record<string, number>;
}

export default function TicketScrollBar({ dates, containerId, ticketCounts }: TicketScrollBarProps) {
  const [activeDate, setActiveDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;

    const handleScroll = () => {
      const sections = dates
        .map(date => document.getElementById(`date-${date}`))
        .filter(Boolean);

      let currentSection = '';
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 200) {
            currentSection = section.id.replace('date-', '');
          }
        }
      }
      setActiveDate(currentSection);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => container.removeEventListener('scroll', handleScroll);
  }, [dates, containerId, mounted]);

  const scrollToDate = (date: string) => {
    if (!mounted) return;
    
    const element = document.getElementById(`date-${date}`);
    const container = document.getElementById(containerId);
    
    if (element && container) {
      const elementTop = element.offsetTop;
      const containerTop = container.offsetTop;
      const scrollPosition = elementTop - containerTop - 20;
      
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const formatDateForScrollBar = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const scrollLeft = () => {
    const scrollContainer = document.getElementById('date-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const scrollContainer = document.getElementById('date-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (!mounted) {
    return (
      <div className="w-full bg-background border-b border-border">
        <div className="flex items-center gap-2 p-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {dates.map((date) => (
              <div
                key={date}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card text-sm whitespace-nowrap"
              >
                <span className="font-medium">{formatDateForScrollBar(date)}</span>
                <Badge variant="outline" className="text-xs">
                  {ticketCounts[date] || 0}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background border-b border-border sticky top-0 z-10">
      <div className="flex items-center gap-2 p-4">
        {/* Left scroll button */}
        <Button
          variant="outline"
          size="sm"
          onClick={scrollLeft}
          className="flex-shrink-0 h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Scrollable date container */}
        <div 
          id="date-scroll-container"
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dates.map((date) => {
            const isActive = activeDate === date;
            const ticketCount = ticketCounts[date] || 0;
            
            return (
              <button
                key={date}
                onClick={() => scrollToDate(date)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card hover:bg-accent border-border'
                }`}
              >
                <span className="font-medium">{formatDateForScrollBar(date)}</span>
                <Badge 
                  variant={isActive ? 'secondary' : 'outline'} 
                  className={`text-xs ${
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20' : ''
                  }`}
                >
                  {ticketCount}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Right scroll button */}
        <Button
          variant="outline"
          size="sm"
          onClick={scrollRight}
          className="flex-shrink-0 h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}