'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    CheckCircleIcon,
    CalendarIcon,
    TagIcon,
    ArrowLeftOnRectangleIcon,
    SunIcon,
    MoonIcon,
    SparklesIcon,
    UserIcon,
    CogIcon
} from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
    { name: 'My Tasks', icon: CheckCircleIcon, href: '/dashboard/tasks' },
    { name: 'Today', icon: CalendarIcon, href: '/dashboard/today' },
    { name: 'Priority', icon: TagIcon, href: '/dashboard/priority' },
];

interface SidebarProps {
    onNavItemClick?: () => void;
    isMobile?: boolean;
}

export default function Sidebar({ onNavItemClick, isMobile = false }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    useEffect(() => {
        setMounted(true);
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/auth');
        if (onNavItemClick) onNavItemClick();
    };

    const isActive = (path: string) => pathname === path;

    if (!mounted) return null;

    return (
        <aside className={`flex flex-col h-full bg-white border-r border-gray-200 ${!isMobile ? "w-64" : "w-full"}`}>
            {/* Brand */}
            <div className="h-20 flex items-center px-6 border-b border-gray-200">
                <Link href="/" className="flex items-center gap-3 group" onClick={onNavItemClick}>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#38BDF8] text-white shadow-md">
                        <SparklesIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-[#333333]">
                        <span className="text-[#0077FF]">Smart</span>
                        <span className="text-[#FF6B35]">Do</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
                    Navigation
                </div>
                {menuItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onNavItemClick}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                                ? 'bg-[#0077FF] text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-[#0077FF]'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Settings */}
            <div className="p-4 border-t border-gray-200 space-y-4 bg-gray-50">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        {theme === 'dark' ? (
                            <MoonIcon className="w-5 h-5 text-gray-600" />
                        ) : (
                            <SunIcon className="w-5 h-5 text-[#FF6B35]" />
                        )}
                        <span className="text-xs font-medium text-gray-600">Theme</span>
                    </div>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="relative p-1 w-12 h-6 rounded-full bg-gray-200 transition-colors"
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#38BDF8] flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#333333] truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Logout"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#333333] transition-colors">
                        <CogIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#333333] transition-colors">
                        <UserIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
}