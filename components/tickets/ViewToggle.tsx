'use client';

import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ViewToggle({
  value,
  onChange,
}: {
  value: 'card' | 'list';
  onChange: (v: 'card' | 'list') => void;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v: string) => v && onChange(v as 'card' | 'list')}
      className="rounded-md border"
    >
      <ToggleGroupItem value="card" aria-label="Card view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
