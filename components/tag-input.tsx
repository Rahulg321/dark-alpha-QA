"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TagInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  tags: string[];
  setTags: (tags: string[]) => void;
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  className?: string;
  badgeClassName?: string;
  inputClassName?: string;
}

export function TagInput({
  tags,
  setTags,
  maxTags,
  onTagAdd,
  onTagRemove,
  className,
  badgeClassName,
  inputClassName,
  disabled,
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    // Don't add empty tags or duplicates
    if (!trimmedTag || tags.includes(trimmedTag)) {
      return;
    }

    // Check if we've reached the maximum number of tags
    if (maxTags !== undefined && tags.length >= maxTags) {
      return;
    }

    const newTags = [...tags, trimmedTag];
    setTags(newTags);
    onTagAdd?.(trimmedTag);
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    const tagToRemove = tags[indexToRemove];
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onTagRemove?.(tagToRemove);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove the last tag when backspace is pressed and input is empty
      removeTag(tags.length - 1);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={cn("flex flex-col w-full space-y-2", className)}>
      <div
        className={cn(
          "flex flex-wrap gap-2 my-4 min-h-8",
          tags.length === 0 && "hidden"
        )}
        aria-live="polite"
      >
        {tags.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="secondary"
            className={cn("px-3 py-1 text-sm", badgeClassName)}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-full"
              aria-label={`Remove ${tag}`}
              disabled={disabled}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Input field */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={cn(
          "flex items-center w-full",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={
            disabled || (maxTags !== undefined && tags.length >= maxTags)
          }
          className={cn(inputClassName)}
          {...props}
        />
      </div>

      {/* Helper text for max tags */}
      {maxTags !== undefined && (
        <p className="text-xs text-muted-foreground">
          {tags.length} of {maxTags} tags added
        </p>
      )}
    </div>
  );
}
