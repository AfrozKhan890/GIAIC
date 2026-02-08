'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search tasks by title or description..."}
        className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-input bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        aria-label="Search tasks"
      />
      <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground pointer-events-none" />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}