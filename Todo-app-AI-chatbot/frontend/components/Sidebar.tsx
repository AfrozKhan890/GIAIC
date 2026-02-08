'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  CheckCircleIcon,
  CalendarIcon,
  TagIcon,
  ArrowLeftOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
  { name: 'Completed', icon: CheckCircleIcon, href: '/dashboard/completed' },
  { name: 'Today', icon: CalendarIcon, href: '/dashboard/today' },
  { name: 'Priority', icon: TagIcon, href: '/dashboard/priority' },
  { name: 'Analytics', icon: ChartBarIcon, href: '/dashboard/analytics' },
  { name: 'Settings', icon: Cog6ToothIcon, href: '/dashboard/settings' },
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
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/auth');
    if (onNavItemClick) onNavItemClick();
  };

  if (!mounted) return null;

  return (
    <aside className={cn(
      "h-full bg-card border-r border-border/50 flex flex-col transition-all duration-300",
      isMobile ? "w-full" : "w-64"
    )}>
      {/* Brand */}
      <div className="h-20 px-6 flex items-center border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 group" onClick={onNavItemClick}>
          <div className="p-2.5 rounded-xl bg-gradient-ai text-gray-900 shadow-lg shadow-[#00F5D4]/30 group-hover:scale-110 transition-transform">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">TaskSync</span>
            <span className="text-xs font-semibold gradient-text uppercase tracking-wider">AI</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 mb-2">
          Navigation
        </div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavItemClick}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 bg-primary/5 rounded-lg -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Settings */}
      <div className="p-4 border-t border-border/50 space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <MoonIcon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <SunIcon className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-xs font-medium">Theme</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-7 w-12 rounded-full relative"
          >
            <motion.div
              animate={{ x: theme === 'dark' ? 20 : 0 }}
              className="absolute left-1 w-5 h-5 bg-primary rounded-full"
            />
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
          <div className="w-10 h-10 rounded-lg bg-gradient-ai flex items-center justify-center text-gray-900 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
            title="Logout"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}