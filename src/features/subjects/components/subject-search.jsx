'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SubjectSearch({ value, onChange }) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search subjects..."
        aria-label="Search subjects"
        className="h-10 pr-10 pl-9"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-2 -translate-y-1/2"
          aria-label="Clear subject search"
        >
          <X />
        </Button>
      )}
    </div>
  );
}
