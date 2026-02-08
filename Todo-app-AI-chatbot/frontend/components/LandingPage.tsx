'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SparklesIcon,
    BoltIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    SunIcon,
    MoonIcon,
    CpuChipIcon,
    ShieldCheckIcon,
    Bars3Icon,
    XMarkIcon,
    ChartBarIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

const features = [
    {
        icon: SparklesIcon,
        title: "AI-Powered",
        description: "Smart AI suggests tasks and optimizes your workflow",
        color: "from-[#0077FF] to-[#38BDF8]"
    },
    {
        icon: BoltIcon,
        title: "Blazing Fast",
        description: "Instant task management with zero latency",
        color: "from-[#FF6B35] to-[#FF9E6D]"
    },
    {
        icon: ShieldCheckIcon,
        title: "Secure",
        description: "Your data is encrypted and protected",
        color: "from-[#22C55E] to-[#4ADE80]"
    },
    {
        icon: CpuChipIcon,
        title: "Smart Insights",
        description: "Get productivity analytics and reports",
        color: "from-[#8B5CF6] to-[#A78BFA]"
    }
];

const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "500K+", label: "Tasks Managed" },
    { value: "99%", label: "Satisfaction" },
    { value: "24/7", label: "AI Support" }
];

export default function LandingPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#38BDF8]">
                                <SparklesIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-[#333333]">
                                <span className="text-[#0077FF]">Smart</span>
                                <span className="text-[#FF6B35]">Do</span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-600 hover:text-[#0077FF] font-medium">Features</a>
                            <a href="#stats" className="text-gray-600 hover:text-[#0077FF] font-medium">Stats</a>
                            <a href="#pricing" className="text-gray-600 hover:text-[#0077FF] font-medium">Pricing</a>
                            
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                {theme === 'dark' ? (
                                    <SunIcon className="w-5 h-5 text-[#FF6B35]" />
                                ) : (
                                    <MoonIcon className="w-5 h-5 text-gray-600" />
                                )}
                            </button>

                            <Link href="/auth">
                                <button className="px-6 py-2 bg-[#0077FF] text-white rounded-lg font-semibold hover:bg-[#0066DD] transition-colors">
                                    Get Started
                                </button>
                            </Link>
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="w-6 h-6 text-gray-600" />
                            ) : (
                                <Bars3Icon className="w-6 h-6 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t border-gray-200"
                        >
                            <div className="px-4 py-4 space-y-4">
                                <a href="#features" className="block text-gray-600 hover:text-[#0077FF] font-medium">Features</a>
                                <a href="#stats" className="block text-gray-600 hover:text-[#0077FF] font-medium">Stats</a>
                                <a href="#pricing" className="block text-gray-600 hover:text-[#0077FF] font-medium">Pricing</a>
                                <Link href="/auth" className="block">
                                    <button className="w-full px-6 py-2 bg-[#0077FF] text-white rounded-lg font-semibold hover:bg-[#0066DD] transition-colors">
                                        Get Started
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077FF]/10 text-[#0077FF] text-sm font-semibold mb-6"
                    >
                        <SparklesIcon className="w-4 h-4" />
                        Smart Task Management
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#333333] mb-6"
                    >
                        Get More Done with
                        <span className="block text-[#0077FF]">Smart AI Assistant</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
                    >
                        SmartDo combines AI intelligence with simple task management to help you stay productive and organized.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href="/auth">
                            <button className="px-8 py-3 bg-[#0077FF] text-white rounded-lg font-semibold hover:bg-[#0066DD] transition-colors flex items-center gap-2">
                                Start Free Trial
                                <ArrowRightIcon className="w-4 h-4" />
                            </button>
                        </Link>
                        <Link href="/auth">
                            <button className="px-8 py-3 border-2 border-[#0077FF] text-[#0077FF] rounded-lg font-semibold hover:bg-[#0077FF]/10 transition-colors">
                                Sign In
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="text-center"
                            >
                                <div className="text-3xl font-bold text-[#333333]">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#333333] mb-4">
                            Why Choose <span className="text-[#0077FF]">SmartDo</span>?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Experience the future of task management with AI-powered features
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} w-fit mb-4`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#333333] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0077FF] to-[#38BDF8]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to boost your productivity?
                    </h2>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are getting more done with SmartDo
                    </p>
                    <Link href="/auth">
                        <button className="px-8 py-3 bg-white text-[#0077FF] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Get Started For Free
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#333333] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#38BDF8]">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold">
                                <span className="text-[#38BDF8]">Smart</span>
                                <span className="text-[#FF6B35]">Do</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} SmartDo. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
                            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
                            <a href="#" className="text-gray-400 hover:text-white">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}