'use client';

import { useState, useTransition } from 'react';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge }    from '@/components/ui/badge';

export default function NewTicketForm({
  action,
}: {
  action: (fd: FormData) => Promise<void>;
}) {
  const [isPending, start] = useTransition();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput('');
  }

  return (
    <form
      className="space-y-6"
      action={(fd) => {
        tags.forEach((t) => fd.append('tags', t));
        start(() => action(fd));
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="block text-sm font-medium">Title</span>
          <Input name="title" required />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium">From&nbsp;name</span>
          <Input name="fromName" required />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium">Priority</span>
          <select
            name="priority"
            className="h-10 w-full rounded-md border px-3 text-sm"
            defaultValue="medium"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium">Type</span>
          <select
            name="type"
            className="h-10 w-full rounded-md border px-3 text-sm"
            defaultValue="website"
          >
            <option value="email">Email</option>
            <option value="website">Website</option>
          </select>
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="block text-sm font-medium">Description</span>
        <Textarea name="description" rows={4} required />
      </label>

      {/* tags UI */}
      <div className="space-y-2">
        <span className="block text-sm font-medium">Tags</span>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="cursor-pointer"
              onClick={() =>
                setTags((prev) => prev.filter((_, idx) => idx !== i))
              }
            >
              {tag} ✕
            </Badge>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating…' : 'Create Ticket'}
      </Button>
    </form>
  );
}
