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
      container.querySelectorAll<HTMLHeadingElement>('h3[data-date]')
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setCurrent(visible[0].target.getAttribute('data-date'));
        }
      },
      { root: container, threshold: 0.5 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [containerId, dates.join()]);

  return (
    <nav className="sticky top-20 flex flex-col gap-1 pr-4 text-xs">
      {dates.map((d) => (
        <a
          key={d}
          href={`#date-${d}`}
          className={cn(
            'rounded px-2 py-1 capitalize hover:bg-accent',
            current === d && 'bg-accent text-accent-foreground font-medium'
          )}
        >
          {d}
        </a>
      ))}
    </nav>
  );
}
