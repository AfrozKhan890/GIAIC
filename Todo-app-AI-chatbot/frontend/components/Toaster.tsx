'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--foreground))',
          borderRadius: '0.75rem',
          padding: '1rem',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--primary))',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--destructive))',
          },
        },
      }}
    />
  );
}