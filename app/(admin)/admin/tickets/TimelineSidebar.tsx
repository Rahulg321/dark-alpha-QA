'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export default function TimelineSidebar({
  dates,
  containerId,
}: {
  // array of ISO date strings (e.g. "2025-06-18")
  dates: string[];
  // id of the scrollable tickets div so we can query headings
  containerId: string;
}) {
  const [current, setCurrent] = React.useState<string | null>(null);

  React.useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const headings = Array.from(
      container.querySelectorAll<HTMLHeadingElement>('section[id^="date-"]')
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.id;
          setCurrent(id.replace('date-', ''));
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [containerId, dates.join()]);

  // Calculate current position for scroll indicator
  const activeIdx = current ? dates.indexOf(current) : 0;
  const totalDates = dates.length;

  return (
    <aside className="sticky top-20 hidden lg:block">
      <div className="flex flex-col items-center space-y-1 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-4 shadow-lg">
        {/* Header indicator */}
        <div className="text-xs font-medium text-muted-foreground mb-2">
          {activeIdx + 1} / {totalDates}
        </div>
        
        {/* Scroll track */}
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
            const isActive = current === d;
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
                
                {/* Date label - positioned to the LEFT to avoid screen edge issues */}
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
        {current && (
          <div className="text-xs text-center text-muted-foreground mt-2 font-medium">
            {new Date(current).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
