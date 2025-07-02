'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Tag, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TagSearchFilter({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get currently selected tags from URL (using 'tag' param)
  const currentTags = useMemo(() => {
    return searchParams.get('tag')?.split(',').filter(Boolean) || [];
  }, [searchParams]);
  
  // Search input state
  const [searchInput, setSearchInput] = useState('');
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter tags based on search input
  useEffect(() => {
    if (searchInput) {
      const filtered = tags.filter(
        tag => tag.toLowerCase().includes(searchInput.toLowerCase()) && !currentTags.includes(tag)
      );
      setFilteredTags(filtered);
      setIsDropdownOpen(filtered.length > 0);
    } else {
      setFilteredTags([]);
      setIsDropdownOpen(false);
    }
  }, [searchInput, tags, currentTags]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle tag selection/deselection
  const toggleTag = (tag: string) => {
    let newTags: string[];
    
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter(t => t !== tag);
    } else {
      newTags = [...currentTags, tag];
    }
    
    updateUrl(newTags);
    setSearchInput('');
  };

  // Update URL with selected tags
  const updateUrl = (selectedTags: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedTags.length > 0) {
      params.set('tag', selectedTags.join(','));
    } else {
      params.delete('tag');
    }
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-3 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Filter by Tags</h3>
      </div>
      
      {/* Selected tags */}
      {currentTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {currentTags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary/70 transition-colors"
            >
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
          {currentTags.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => updateUrl([])}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
      
      {/* Search input */}
      <div className="relative" ref={inputRef}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for tags..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 w-full bg-background"
          />
        </div>
        
        {/* Dropdown for filtered tags */}
        {isDropdownOpen && filteredTags.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredTags.map(tag => (
              <div
                key={tag}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-accent gap-2 text-sm"
                onClick={() => {
                  toggleTag(tag);
                  setIsDropdownOpen(false);
                }}
              >
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 