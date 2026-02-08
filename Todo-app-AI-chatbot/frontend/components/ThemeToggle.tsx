'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-40 h-10 bg-muted rounded-full animate-pulse" />
    );
  }

  const options = [
    { value: 'light', icon: SunIcon, label: 'Light' },
    { value: 'dark', icon: MoonIcon, label: 'Dark' },
    { value: 'system', icon: ComputerDesktopIcon, label: 'Auto' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-full bg-card border border-border glass-border">
      {options.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${theme === option.value
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <option.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
}