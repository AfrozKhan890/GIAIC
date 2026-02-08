'use client';

import { PRIORITIES, PRIORITY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PrioritySelectorProps {
  value: string | null;
  onChange: (value: string) => void;
}

export default function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRIORITIES.map((pri) => {
        const isSelected = value === pri.value;
        return (
          <motion.button
            key={pri.value}
            type="button"
            onClick={() => onChange(pri.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 border-2",
              isSelected
                ? `${PRIORITY_COLORS[pri.color]} border-primary shadow-lg shadow-primary/20`
                : "bg-card hover:bg-accent border-transparent hover:border-primary/30 text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={isSelected}
            aria-label={`Set priority to ${pri.label}`}
          >
            <span className="text-lg">{pri.icon}</span>
            <span>{pri.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}