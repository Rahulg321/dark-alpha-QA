'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props: sections - array of objects with section info for the ticket detail view
 */
interface TicketSection {
  id: string;
  label: string;
  type: 'date' | 'original' | 'reply' | 'form' | 'related';
}

export default function TicketDetailSidebar({ sections }: { sections: TicketSection[] }) {
  const [active, setActive] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver>();

  /* ------------------------------------------------------------------ */
  /* install a single IntersectionObserver for all sections             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const opts: IntersectionObserverInit = {
      rootMargin: '0px 0px -60% 0px',
      threshold: 0,
    };

    observer.current = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const sectionId = e.target.getAttribute('data-section') || e.target.id;
          if (sectionId) setActive(sectionId);
        }
      });
    }, opts);

    /* attach to every section */
    sections.forEach(section => {
      const el = document.querySelector<HTMLElement>(`#${section.id}`);
      if (el) observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [sections]);

  /* ------------------------------------------------------------------ */
  /* Calculate current position for scroll indicator                     */
  /* ------------------------------------------------------------------ */
  const activeIdx = active ? sections.findIndex(s => s.id === active) : 0;
  const totalSections = sections.length;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'date': return '📅';
      case 'original': return '🎫';
      case 'reply': return '💬';
      case 'form': return '✏️';
      case 'related': return '🔗';
      default: return '•';
    }
  };

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
      <div className="flex flex-col items-center space-y-1 bg-background/95 backdrop-blur-md border border-border/60 rounded-xl px-3 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-background/98">
        {/* Header indicator */}
        <div className="text-xs font-medium text-muted-foreground mb-2">
          {activeIdx + 1} / {totalSections}
        </div>
        
        {/* Scroll track - made taller to match Google style */}
        <div className="relative h-40 w-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
          {/* Progress indicator - enhanced gradient with glow */}
          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-400 via-indigo-500 to-indigo-600 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{
              height: `${totalSections > 0 ? ((activeIdx + 1) / totalSections) * 100 : 0}%`,
              boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)',
            }}
          />
        </div>

        {/* Section indicators */}
        <div className="flex flex-col items-center space-y-3 mt-2">
          {sections.map((section, index) => {
            const isActive = active === section.id;
            
            return (
              <button
                key={section.id}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(section.id);
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
                {/* Section dot */}
                <div
                  className={cn(
                    'w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs transition-all duration-300 transform',
                    isActive
                      ? 'bg-indigo-500 scale-125 shadow-lg shadow-indigo-500/40 text-white ring-2 ring-indigo-200'
                      : 'bg-muted-foreground/50 group-hover:bg-indigo-400/70 text-muted-foreground group-hover:text-white group-hover:scale-110 group-hover:shadow-md'
                  )}
                >
                  {getIconForType(section.type) === '•' ? (
                    <div className="w-1 h-1 bg-current rounded-full" />
                  ) : (
                    <span className="text-[8px]">{getIconForType(section.type)}</span>
                  )}
                </div>
                
                {/* Section label - positioned to the LEFT instead of right to avoid screen edge issues */}
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
                    {section.label}
                  </div>
                  {/* Arrow pointing right instead of left */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-border" />
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Current section label at bottom */}
        {active && (
          <div className="text-xs text-center text-muted-foreground mt-2 font-medium">
            {sections.find(s => s.id === active)?.label}
          </div>
        )}
      </div>
    </aside>
  );
}