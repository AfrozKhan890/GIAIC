'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search tasks..."}
        className="w-full pl-10 pr-10 py-3 rounded-lg border-2 border-gray-300 bg-white text-[#333333] focus:border-[#0077FF] focus:ring-2 focus:ring-[#0077FF]/20 transition-all"
        aria-label="Search tasks"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}