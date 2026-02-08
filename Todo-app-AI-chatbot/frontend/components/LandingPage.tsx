'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SunIcon,
  MoonIcon,
  CpuChipIcon,
  CloudIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Statistics', href: '#stats' },
  { name: 'About', href: '#about' },
  { name: 'Developers', href: '#developers' },
];

const stats = [
  { value: '10K+', label: 'Active Users', description: 'Productivity professionals', color: 'text-[#00F5D4]' },
  { value: '50K+', label: 'Tasks Managed', description: 'Successfully orchestrated', color: 'text-[#6BFFB8]' },
  { value: '99.9%', label: 'Uptime', description: 'Reliable infrastructure', color: 'text-[#FF9E6D]' },
  { value: '4.9/5', label: 'Rating', description: 'User satisfaction', color: 'text-[#A78BFA]' },
];

const features = [
  {
    icon: SparklesIcon,
    title: 'AI-Powered Intelligence',
    description: 'Our neural network understands context, predicts priorities, and suggests optimal workflows based on your patterns.',
    color: 'from-[#00F5D4] to-[#00C9A7]',
  },
  {
    icon: CpuChipIcon,
    title: 'Real-Time Collaboration',
    description: 'Sync tasks across teams instantly with conflict-free merging and real-time updates powered by CRDT algorithms.',
    color: 'from-[#6BFFB8] to-[#00D4AA]',
  },
  {
    icon: BoltIcon,
    title: 'Lightning Performance',
    description: 'Built on WebAssembly and edge computing for sub-50ms response times, handling thousands of concurrent operations.',
    color: 'from-[#FF9E6D] to-[#FF7A45]',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, zero-knowledge architecture, and SOC2 compliance for mission-critical data protection.',
    color: 'from-[#A78BFA] to-[#8B5CF6]',
  },
  {
    icon: CloudIcon,
    title: 'Global Infrastructure',
    description: 'Deployed across 15 regions with automatic failover and geo-redundant storage for 24/7 availability.',
    color: 'from-[#60A5FA] to-[#3B82F6]',
  },
  {
    icon: UsersIcon,
    title: 'Team Workflows',
    description: 'Customizable permission layers, automated handoffs, and integrated communication channels for seamless collaboration.',
    color: 'from-[#F472B6] to-[#EC4899]',
  },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#00F5D4]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#6BFFB8]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-[#A78BFA]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className="p-2.5 rounded-xl bg-gradient-ai text-gray-900 shadow-lg shadow-[#00F5D4]/30 group-hover:scale-110 transition-transform">
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight">TaskSync</span>
                  <span className="text-xs font-semibold gradient-text uppercase tracking-wider">AI</span>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm font-medium hover:text-primary transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-ai transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full hover:bg-primary/10"
              >
                {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </Button>
              
              <Link href="/auth">
                <Button className="glow-effect">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>AI-Powered Productivity Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            >
              Intelligent Task
              <br />
              <span className="gradient-text">Orchestration</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              TaskSync AI combines machine learning with intuitive design to transform how 
              teams manage workflows, predict bottlenecks, and achieve peak productivity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Link href="/auth" className="w-full sm:w-auto">
                <Button size="xl" className="w-full sm:w-auto glow-effect bg-gradient-ai text-gray-900">
                  Start Free Trial
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-8 rounded-2xl text-center space-y-3"
              >
                <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-lg font-semibold">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold gradient-text">Enterprise-Grade Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for teams that demand performance, security, and intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={cn(
                  "glass p-8 rounded-2xl space-y-6 cursor-pointer transition-all duration-300",
                  activeFeature === index && "ring-2 ring-primary/50"
                )}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} w-fit`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass p-12 rounded-3xl text-center space-y-8 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-ai opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Productivity?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of teams that have accelerated their workflow with TaskSync AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button size="xl" className="glow-effect bg-gradient-ai text-gray-900">
                    Get Started Free
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-ai text-gray-900">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-bold">TaskSync AI</div>
                <div className="text-sm text-muted-foreground">Intelligent Task Management</div>
              </div>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Contact</a>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskSync AI. Built by  Afroz Khan.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}