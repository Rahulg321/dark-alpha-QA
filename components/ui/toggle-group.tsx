'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '@/lib/utils';                  // ← same helper used in your other shadcn UI files

/** ──────────────────────────────────────────────────────────────────────────
 *  Root – works exactly like the Radix `<ToggleGroup />`
 *  (Kept as a re-export so the API is identical to shadcn’s scaffold.)
 *  ────────────────────────────────────────────────────────────────────────*/
export const ToggleGroup = ToggleGroupPrimitive.Root;

/** ──────────────────────────────────────────────────────────────────────────
 *  Item – styled to match the rest of the shadcn components
 *  ────────────────────────────────────────────────────────────────────────*/
export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      // --- Base
      'inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      // --- Size variants (match <Button size="sm">)
      'h-8 w-8',
      // --- Variant="outline"
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      // --- When pressed (Radix “data-state=on”)
      'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      className,
    )}
    {...props}
  />
));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
