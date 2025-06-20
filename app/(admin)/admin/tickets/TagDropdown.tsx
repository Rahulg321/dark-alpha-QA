'use client';

import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Searchable tag selector. It reads & mutates the URL query string directly,
 * so the parent Server Component never needs to pass event callbacks.
 */
export default function TagDropdown({ tags }: { tags: string[] }) {
  const [open, setOpen] = React.useState(false);
  const router       = useRouter();
  const searchParams = useSearchParams();
  const active       = searchParams.get('tag');       // null | current tag

  /** helper: push new ?tag=… (or remove it) without full reload */
  function go(tag: string | null) {
    const qs = new URLSearchParams(searchParams.toString());
    tag ? qs.set('tag', tag) : qs.delete('tag');
    router.push(qs.toString() ? `?${qs.toString()}` : '?', { scroll: false });
    setOpen(false);
  }

  const items = [null, ...tags];                      // null → “All”
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex h-8 items-center gap-2 rounded-md border px-3 text-sm font-medium">
          <span className="capitalize">
            {active ?? 'tags…'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-0">
        <Command loop>
          <CommandInput placeholder="Search…" />
          <CommandList>
            {items.map((tag) => (
              <CommandItem
                key={tag ?? 'all'}
                onSelect={() => go(tag)}
                className={cn(
                  'flex justify-between',
                  active === tag && 'font-medium'
                )}
              >
                <span className="capitalize">{tag ?? 'All'}</span>
                {active === tag && '✓'}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
