'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface UserScrollbarTimelineProps {
  dates: string[];
  containerId: string;
}

export default function UserScrollbarTimeline({ dates, containerId }: UserScrollbarTimelineProps) {
  const [active, setActive] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    const opts: IntersectionObserverInit = {
      rootMargin: '0px 0px -60% 0px',
      threshold: 0,
    };

    observer.current = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const day = e.target.getAttribute('data-day');
          if (day) setActive(day);
        }
      });
    }, opts);

    // Attach to every <section data-day="YYYY-MM-DD"> in main column
    dates.forEach(d => {
      const el = document.querySelector<HTMLElement>(`#date-${d}`);
      if (el) observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [dates]);

  // Calculate current position for scroll indicator
  const activeIdx = active ? dates.indexOf(active) : 0;
  const totalDates = dates.length;

  if (dates.length === 0) return null;

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
      <div className="flex flex-col items-center space-y-1 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-4 shadow-lg">
        {/* Header indicator */}
        <div className="text-xs font-medium text-muted-foreground mb-2">
          {activeIdx + 1} / {totalDates}
        </div>
        
        {/* Scroll track - blue gradient like Google's */}
        <div className="relative h-40 w-1 bg-muted rounded-full overflow-hidden">
          {/* Progress indicator */}
          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{
              height: `${((activeIdx + 1) / totalDates) * 100}%`,
            }}
          />
        </div>

        {/* Date indicators */}
        <div className="flex flex-col items-center space-y-3 mt-2">
          {dates.map((d, index) => {
            const isActive = active === d;
            const date = new Date(d);
            
            return (
              <a
                key={d}
                href={`#date-${d}`}
                className={cn(
                  'group flex flex-col items-center transition-all duration-200',
                  'hover:scale-110 relative'
                )}
              >
                {/* Date dot */}
                <div
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-200',
                    isActive
                      ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/25'
                      : 'bg-muted-foreground/40 group-hover:bg-blue-400/60'
                  )}
                />
                
                {/* Date label - positioned to the LEFT */}
                <div
                  className={cn(
                    'absolute right-full mr-3 px-2 py-1 bg-popover border border-border rounded-md shadow-md',
                    'text-xs font-medium whitespace-nowrap pointer-events-none',
                    'transition-all duration-200 opacity-0 scale-95 -translate-x-2',
                    'group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0',
                    isActive && 'opacity-100 scale-100 translate-x-0'
                  )}
                >
                  <div className="text-foreground">
                    {date.toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  {/* Arrow pointing right */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-border" />
                </div>
              </a>
            );
          })}
        </div>
        
        {/* Current date label at bottom */}
        {active && (
          <div className="text-xs text-center text-muted-foreground mt-2 font-medium">
            {new Date(active).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        )}
      </div>
    </aside>
  );
}