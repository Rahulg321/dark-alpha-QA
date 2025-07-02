'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface UserTimelineSidebarProps {
  dates: string[];
  containerId: string;
  ticketCounts: Record<string, number>;
}

export default function UserTimelineSidebar({ dates, containerId, ticketCounts }: UserTimelineSidebarProps) {
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

  const formatDateForSidebar = (dateString: string) => {
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

  if (!mounted) {
    return (
      <div className="w-48 flex-shrink-0">
        <div className="sticky top-6 space-y-1">
          <h3 className="px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Timeline
          </h3>
          <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            {dates.map((date) => (
              <div
                key={date}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md text-muted-foreground"
              >
                <span className="font-medium">{formatDateForSidebar(date)}</span>
                <Badge variant="outline" className="text-xs h-5 min-w-[20px]">
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
    <div className="w-48 flex-shrink-0">
      <div className="sticky top-6 space-y-1">
        <h3 className="px-3 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Timeline
        </h3>
        <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {dates.map((date) => {
            const isActive = activeDate === date;
            const ticketCount = ticketCounts[date] || 0;
            
            return (
              <button
                key={date}
                onClick={() => scrollToDate(date)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="font-medium">{formatDateForSidebar(date)}</span>
                <Badge 
                  variant={isActive ? 'secondary' : 'outline'} 
                  className={`text-xs h-5 min-w-[20px] ${
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : ''
                  }`}
                >
                  {ticketCount}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}