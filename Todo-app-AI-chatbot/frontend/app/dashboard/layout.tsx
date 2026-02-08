'use client';

import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-warm-beige/20 via-transparent to-soft-lavender/10 dark:bg-gradient-to-br dark:from-deep-blue/10 dark:via-charcoal/5 dark:to-deep-blue/5 text-foreground flex flex-col lg:flex-row transition-colors duration-300">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-[60] bg-background/90 backdrop-blur-xl border-b border-border/20 h-16 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-pistachio-green/80 to-soft-lavender/80 text-white shadow-lg shadow-pistachio-green/20 group-hover:scale-105 transition-transform duration-300">
                        <SparklesIcon className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        <span className="bg-gradient-to-r from-pistachio-green to-soft-lavender bg-clip-text text-transparent">
                            AI Todo Genius
                        </span>
                    </span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-all active:scale-95 border border-border/30"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? 
                        <XMarkIcon className="w-6 h-6" /> : 
                        <Bars3Icon className="w-6 h-6" />
                    }
                </button>
            </header>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 shrink-0 border-r border-border/30 bg-background/50 backdrop-blur-sm">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-background/70 backdrop-blur-md z-[70] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] z-[80] bg-background/95 backdrop-blur-xl border-r border-border/30 shadow-2xl lg:hidden flex flex-col"
                        >
                            <Sidebar onNavItemClick={() => setIsMobileMenuOpen(false)} isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 transition-all duration-300 w-full">
                <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                    <div className="bg-gradient-to-br from-warm-beige/5 to-soft-lavender/5 dark:from-charcoal/20 dark:to-deep-blue/10 rounded-3xl p-1">
                        <div className="bg-background/70 backdrop-blur-sm rounded-2xl border border-border/20 shadow-lg">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}