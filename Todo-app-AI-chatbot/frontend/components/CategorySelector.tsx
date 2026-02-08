'use client';

import { CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CategorySelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isSelected = value === cat.value;
        return (
          <motion.button
            key={cat.value}
            type="button"
            onClick={() => onChange(isSelected ? null : cat.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 border-2",
              isSelected
                ? `${CATEGORY_COLORS[cat.color]} border-primary shadow-lg shadow-primary/20`
                : "bg-card hover:bg-accent border-transparent hover:border-primary/30 text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={isSelected}
            aria-label={`Select ${cat.label} category`}
          >
            <span className="text-lg">{cat.icon}</span>
            <span>{cat.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}