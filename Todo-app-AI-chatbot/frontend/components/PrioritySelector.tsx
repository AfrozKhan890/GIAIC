'use client';

import { PRIORITIES } from '@/lib/constants';

interface PrioritySelectorProps {
  value: string | null;
  onChange: (value: string) => void;
}

export default function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <div className="flex gap-2">
      {PRIORITIES.map(pri => {
        const isSelected = value === pri.value;
        const colorClass = {
          high: 'bg-red-100 text-red-800 border-red-300',
          medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          low: 'bg-green-100 text-green-800 border-green-300'
        }[pri.color];

        const selectedClass = isSelected ? 'ring-2 ring-offset-1' : '';

        return (
          <button
            key={pri.value}
            type="button"
            onClick={() => onChange(pri.value)}
            className={`px-4 py-2 rounded-lg font-medium border transition-all flex items-center gap-2 ${colorClass} ${selectedClass}`}
            aria-pressed={isSelected}
          >
            <span>{pri.icon}</span>
            <span>{pri.label}</span>
          </button>
        );
      })}
    </div>
  );
}