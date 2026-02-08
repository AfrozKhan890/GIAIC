'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFFFFF',
          color: '#333333',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#22C55E',
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        },
        loading: {
          iconTheme: {
            primary: '#0077FF',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
}