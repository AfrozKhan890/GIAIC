'use client';

import { CATEGORIES } from '@/lib/constants';

interface CategorySelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(cat => {
        const isSelected = value === cat.value;
        const colorClass = {
          blue: 'bg-blue-100 text-blue-800 border-blue-300',
          purple: 'bg-purple-100 text-purple-800 border-purple-300',
          green: 'bg-green-100 text-green-800 border-green-300',
          red: 'bg-red-100 text-red-800 border-red-300',
          orange: 'bg-orange-100 text-orange-800 border-orange-300',
          teal: 'bg-teal-100 text-teal-800 border-teal-300',
          gray: 'bg-gray-100 text-gray-800 border-gray-300'
        }[cat.color];

        const selectedClass = isSelected ? 'ring-2 ring-offset-1 ring-[#0077FF]' : '';

        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(isSelected ? null : cat.value)}
            className={`px-3 py-2 rounded-lg font-medium border transition-all flex items-center gap-2 ${colorClass} ${selectedClass}`}
            aria-pressed={isSelected}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}