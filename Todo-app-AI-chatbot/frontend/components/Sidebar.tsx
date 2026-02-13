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

  // Function to check if a route is active
  const isRouteActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
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
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] text-gray-900 shadow-lg shadow-[#00F5D4]/30 group-hover:scale-110 transition-transform">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">TaskSync</span>
            <span className="text-xs font-semibold bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] bg-clip-text text-transparent uppercase tracking-wider">
              AI
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 mb-2">
          Navigation
        </div>
        {menuItems.map((item) => {
          const isActive = isRouteActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavItemClick}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-gradient-to-r from-[#00F5D4]/20 to-[#00D9F5]/20 text-[#00F5D4] border-l-4 border-[#00F5D4]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-200",
                isActive && "scale-110 text-[#00F5D4]"
              )} />
              <span className={cn(
                "transition-all duration-200",
                isActive && "font-semibold"
              )}>
                {item.name}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 bg-gradient-to-r from-[#00F5D4]/10 to-[#00D9F5]/10 rounded-lg -z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
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
            className="h-7 w-12 rounded-full relative bg-accent"
          >
            <motion.div
              animate={{ x: theme === 'dark' ? 20 : 0 }}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] rounded-full shadow-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg">
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
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Logout"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Version Info */}
      <div className="px-4 pb-4 text-[10px] text-muted-foreground/50 text-center">
        TaskSync AI v1.0.0
      </div>
    </aside>
  );
}