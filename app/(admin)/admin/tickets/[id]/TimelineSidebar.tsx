'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props: the list of unique YYYY-MM-DD strings
 */
export default function TimelineSidebar({ dates }: { dates: string[] }) {
  const [active, setActive] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver>();

  /* ------------------------------------------------------------------ */
  /* install a single IntersectionObserver for all day sections         */
  /* ------------------------------------------------------------------ */
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

    /* attach to every <section data-day="YYYY-MM-DD"> in main column */
    dates.forEach(d => {
      const el = document.querySelector<HTMLElement>(`#day-${d}`);
      if (el) observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [dates]);

  /* ------------------------------------------------------------------ */
  /* Calculate current position for scroll indicator                     */
  /* ------------------------------------------------------------------ */
  const activeIdx = active ? dates.indexOf(active) : 0;
  const totalDates = dates.length;

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
      <div className="flex flex-col items-center space-y-1 bg-background/90 backdrop-blur-md border border-border/50 rounded-full px-3 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-background/95">
        {/* Header indicator */}
        <div className="text-xs font-medium text-muted-foreground mb-2">
          {activeIdx + 1} / {totalDates}
        </div>
        
        {/* Scroll track - made taller to match Google style */}
        <div className="relative h-40 w-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
          {/* Progress indicator - enhanced gradient with glow */}
          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{
              height: `${((activeIdx + 1) / totalDates) * 100}%`,
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)',
            }}
          />
        </div>

        {/* Date indicators */}
        <div className="flex flex-col items-center space-y-3 mt-2">
          {dates.map((d, index) => {
            const isActive = active === d;
            const date = new Date(d);
            
            return (
              <button
                key={d}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(`day-${d}`);
                  if (element) {
                    element.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className={cn(
                  'group flex flex-col items-center transition-all duration-200',
                  'hover:scale-110 relative cursor-pointer'
                )}
              >
                {/* Date dot */}
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-300 transform',
                    isActive
                      ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/40 ring-2 ring-blue-200'
                      : 'bg-muted-foreground/50 group-hover:bg-blue-400/70 group-hover:scale-110 group-hover:shadow-md'
                  )}
                />
                
                {/* Date label - positioned to the LEFT instead of right to avoid screen edge issues */}
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
                  {/* Arrow pointing right instead of left */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-border" />
                </div>
              </button>
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
