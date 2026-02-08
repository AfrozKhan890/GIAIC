'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      });
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
          throw new Error('Authentication expired. Please login again.');
        }
        throw new Error('Failed to chat with AI');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      setConversationId(data.conversation_id);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'AI assistant is currently unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-ai text-gray-900 rounded-full shadow-2xl shadow-[#00F5D4]/30 z-50 animate-pulse-glow"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </motion.button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border/50 z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-dark">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-ai text-gray-900">
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">AI Assistant</h2>
                    <p className="text-xs gradient-text font-medium">Powered by Gemini</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!isAuthenticated ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheckIcon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold">Authentication Required</h3>
                      <p className="text-sm text-muted-foreground">
                        Sign in to access AI-powered task management assistance.
                      </p>
                    </div>
                    <Link href="/auth" onClick={() => setIsOpen(false)} className="w-full max-w-[200px]">
                      <button className="btn-primary w-full glow-effect">
                        Sign In Now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                        <div className="p-4 bg-card rounded-2xl">
                          <ChatBubbleLeftRightIcon className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold">How can I assist you today?</p>
                          <p className="text-sm text-muted-foreground">
                            Try asking: "Add a task to prepare quarterly report"
                          </p>
                        </div>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                          "flex flex-col max-w-[85%]",
                          msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                      >
                        <div
                          className={clsx(
                            "p-3 rounded-2xl text-sm",
                            msg.role === 'user'
                              ? "bg-gradient-ai text-gray-900 rounded-tr-none"
                              : "bg-accent text-foreground rounded-tl-none"
                          )}
                        >
                          {msg.content}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 capitalize">
                          {msg.role}
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
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    disabled={!isAuthenticated || isLoading}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isAuthenticated ? "Type your message..." : "Please login to chat"}
                    className="w-full p-4 pr-12 rounded-xl bg-card border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || !isAuthenticated}
                    className="absolute right-2 p-2 bg-gradient-ai text-gray-900 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}