'use client';

import { Badge } from '@/components/ui/badge';

export default function TagFilter({
  tickets,
  activeTag,
  onChange,
}: {
  tickets: { tags: string[] }[];
  activeTag: string | null;
  onChange: (tag: string | null) => void;
}) {
  const tags = Array.from(new Set(tickets.flatMap(t => t.tags))).sort();

  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        onClick={() => onChange(null)}
        variant={activeTag === null ? 'default' : 'secondary'}
        className="cursor-pointer"
      >
        All
      </Badge>
      {tags.map(tag => (
        <Badge
          key={tag}
          onClick={() => onChange(tag)}
          variant={activeTag === tag ? 'default' : 'secondary'}
          className="cursor-pointer capitalize"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
