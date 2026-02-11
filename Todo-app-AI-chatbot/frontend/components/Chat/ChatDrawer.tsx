'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Please login to use the AI assistant.', {
        icon: '🔒',
        duration: 4000,
      });
      setIsAuthenticated(false);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('AI assistant is currently unavailable.');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      setConversationId(data.conversation_id);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'AI assistant is currently unavailable.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      toast.loading('Redirecting to login...', {
        duration: 1000,
      });
      setTimeout(() => {
        window.location.href = '/auth';
      }, 500);
      return;
    }
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button - HIDES WHEN DRAWER IS OPEN AND STAYS FIXED */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpenChat}
            className="chatbot-fixed-icon p-4 bg-gradient-ai text-gray-900 rounded-full shadow-2xl shadow-[#00F5D4]/30 animate-pulse-glow touch-manipulation mobile-touch-area"
            aria-label="Open AI Assistant"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseChat}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm chat-drawer-overlay"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border/50 chat-drawer-panel flex flex-col shadow-2xl chat-drawer-full sm:chat-drawer-tablet"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-[#00F5D4]/10 to-[#6BFFB8]/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-ai text-gray-900">
                    <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg sm:text-xl">AI Assistant</h2>
                    <p className="text-xs sm:text-sm gradient-text font-medium">Powered by Gemini</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseChat}
                  className="p-2 hover:bg-accent rounded-lg transition-colors mobile-touch-area"
                  aria-label="Close chat"
                >
                  <XMarkIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 chat-no-scrollbar">
                {!isAuthenticated ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                      <LockClosedIcon className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold">Authentication Required</h3>
                      <p className="text-sm text-muted-foreground">
                        Sign in to access AI-powered task management assistance.
                      </p>
                    </div>
                    <Link href="/auth" onClick={handleCloseChat} className="w-full max-w-[250px]">
                      <button className="btn-primary w-full glow-effect py-3 flex items-center justify-center gap-2">
                        <ArrowRightIcon className="w-5 h-5" />
                        Go to Login Page
                      </button>
                    </Link>
                    <div className="text-sm text-muted-foreground mt-4">
                      <p>AI Assistant can help you:</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Create and organize tasks</li>
                        <li>• Set reminders and deadlines</li>
                        <li>• Generate task suggestions</li>
                        <li>• Plan your daily schedule</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8 sm:py-12">
                        <div className="p-4 bg-card rounded-2xl">
                          <ChatBubbleLeftRightIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                        </div>
                        <div className="space-y-2 px-4">
                          <p className="font-semibold text-base sm:text-lg">How can I assist you today?</p>
                          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                            Try asking: "Add a task to prepare quarterly report"
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm pt-4">
                          <button
                            onClick={() => {
                              setInput('Add a task to prepare quarterly report');
                              setTimeout(() => {
                                const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
                                if (inputEl) inputEl.focus();
                              }, 100);
                            }}
                            className="text-xs sm:text-sm bg-accent hover:bg-accent/80 px-3 py-2 rounded-lg transition-colors text-left"
                          >
                            "Add quarterly report task"
                          </button>
                          <button
                            onClick={() => {
                              setInput('What tasks are due this week?');
                              setTimeout(() => {
                                const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
                                if (inputEl) inputEl.focus();
                              }, 100);
                            }}
                            className="text-xs sm:text-sm bg-accent hover:bg-accent/80 px-3 py-2 rounded-lg transition-colors text-left"
                          >
                            "Tasks due this week"
                          </button>
                        </div>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                          "flex flex-col max-w-[85%] sm:max-w-[80%]",
                          msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                      >
                        <div
                          className={clsx(
                            "p-3 sm:p-4 rounded-2xl text-sm sm:text-base",
                            msg.role === 'user'
                              ? "bg-gradient-ai text-gray-900 rounded-tr-none"
                              : "bg-accent text-foreground rounded-tl-none"
                          )}
                        >
                          {msg.content}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 capitalize">
                          {msg.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-3 text-muted-foreground text-sm py-2">
                        <div className="flex gap-1.5">
                          <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                          />
                        </div>
                        <span className="font-medium">AI is thinking...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 sm:p-6 border-t border-border/50">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    disabled={!isAuthenticated || isLoading}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isAuthenticated ? "Type your message..." : "Sign in to chat with AI"}
                    className="w-full p-3 sm:p-4 pr-12 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 text-sm sm:text-base"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || !isAuthenticated}
                    className="absolute right-2 sm:right-3 p-2 sm:p-2.5 bg-gradient-ai text-gray-900 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mobile-touch-area"
                    aria-label="Send message"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    <Link href="/auth" onClick={handleCloseChat} className="text-primary hover:underline">
                      Sign in
                    </Link>
                    {' '}to unlock AI assistant features
                  </p>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}