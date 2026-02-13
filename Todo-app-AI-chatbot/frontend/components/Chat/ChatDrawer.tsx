'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatResponse {
  response: string;
  conversation_id: string;
  timestamp: string;
}

// Custom hook for authentication with real-time updates
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  
  const pathname = usePathname();

  // Parse JWT token to get user info
  const parseToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  const checkAuth = useCallback(() => {
    setIsAuthChecking(true);
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsAuthChecking(false);
      return false;
    }

    try {
      // Parse user info from token
      const tokenData = parseToken(token);
      if (tokenData) {
        setIsAuthenticated(true);
        setUser({ 
          email: tokenData.email || tokenData.sub,
          name: tokenData.name || tokenData.email?.split('@')[0] || 'User'
        });
      } else {
        // If token can't be parsed, assume it's valid (for development)
        setIsAuthenticated(true);
        setUser({ email: 'user@example.com', name: 'User' });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsAuthChecking(false);
    }

    return true;
  }, []);

  // Check auth on mount and when pathname changes (after login/register)
  useEffect(() => {
    checkAuth();
  }, [checkAuth, pathname]); // Re-check when route changes (after login/register)

  // Listen for storage events (login in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === null) {
        checkAuth();
      }
    };

    // Custom event for same-tab auth updates
    const handleAuthUpdate = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-update', handleAuthUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-update', handleAuthUpdate);
    };
  }, [checkAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('last_conversation_id');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
    
    // Dispatch event for same-tab updates
    window.dispatchEvent(new Event('auth-update'));
  }, []);

  return { isAuthenticated, isAuthChecking, user, logout, checkAuth };
};

export default function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isAuthenticated, isAuthChecking, user, checkAuth } = useAuth();

  // Re-check auth when drawer opens
  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen, checkAuth]);

  // Load saved conversation when authenticated
  useEffect(() => {
    const loadSavedConversation = async () => {
      if (isAuthenticated) {
        const savedConversationId = localStorage.getItem('last_conversation_id');
        if (savedConversationId) {
          setConversationId(savedConversationId);
          await loadConversationHistory(savedConversationId);
        } else {
          // Add welcome message for new users
          setMessages([
            {
              role: 'assistant',
              content: 'Hello! I\'m your AI assistant. I can help you manage tasks, set reminders, answer questions, or provide productivity tips. How can I help you today?',
              timestamp: new Date()
            }
          ]);
        }
      } else {
        // Clear messages when logged out
        setMessages([]);
        setConversationId(null);
      }
    };

    loadSavedConversation();
  }, [isAuthenticated]);

  // Save conversation ID when it changes
  useEffect(() => {
    if (conversationId && isAuthenticated) {
      localStorage.setItem('last_conversation_id', conversationId);
    }
  }, [conversationId, isAuthenticated]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && isAuthenticated && !isAuthChecking) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isAuthenticated, isAuthChecking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversationHistory = async (convId: string) => {
    setIsLoadingHistory(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/history/${convId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const history = await response.json();
        setMessages(history.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Please login to use the AI assistant.', {
        icon: '🔒',
        duration: 4000
      });
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date() 
    }]);
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

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('auth_token');
        localStorage.removeItem('last_conversation_id');
        setConversationId(null);
        setMessages([]);
        
        toast.error('Session expired. Please login again.', {
          duration: 4000,
          icon: '🔒'
        });
        
        // Close drawer after delay
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
        
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to chat with AI');
      }

      const data: ChatResponse = await response.json();
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date(data.timestamp) 
      }]);
      setConversationId(data.conversation_id);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'AI assistant is currently unavailable.', {
        duration: 4000,
        icon: '❌'
      });
      
      // Remove the user message if the API call failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
    setConversationId(null);
    localStorage.removeItem('last_conversation_id');
    inputRef.current?.focus();
  };

  // Show loading state while checking auth
  if (isAuthChecking && isOpen) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] text-gray-900 rounded-full shadow-2xl shadow-[#00F5D4]/30 z-50 hover:shadow-[#00F5D4]/50 transition-shadow"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black border-l border-white/10 z-50 flex flex-col shadow-2xl"
              >
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <ArrowPathIcon className="w-12 h-12 text-[#00F5D4] animate-spin mx-auto" />
                    <p className="text-white/70">Checking authentication...</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] text-gray-900 rounded-full shadow-2xl shadow-[#00F5D4]/30 z-50 hover:shadow-[#00F5D4]/50 transition-shadow animate-pulse-glow"
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
              className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] text-gray-900">
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white">AI Assistant</h2>
                    <p className="text-xs bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] bg-clip-text text-transparent font-medium">
                      {isAuthenticated && user?.name ? `Welcome, ${user.name}` : 'Powered by Gemini'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAuthenticated && (
                    <button
                      onClick={handleNewChat}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                      title="New chat"
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {!isAuthenticated ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00F5D4]/20 to-[#00D9F5]/20 flex items-center justify-center"
                    >
                      <ShieldCheckIcon className="w-12 h-12 text-[#00F5D4]" />
                    </motion.div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-white">Authentication Required</h3>
                      <p className="text-sm text-white/60 max-w-[250px] mx-auto">
                        Sign in to access AI-powered task management assistance and personalized recommendations.
                      </p>
                    </div>
                    <div className="space-y-3 w-full max-w-[200px]">
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-3 px-4 bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          Sign In Now
                        </motion.button>
                      </Link>
                      <p className="text-xs text-white/40">
                        Secure login with email & password
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {isLoadingHistory ? (
                      <div className="flex items-center justify-center py-12">
                        <ArrowPathIcon className="w-8 h-8 text-[#00F5D4] animate-spin" />
                      </div>
                    ) : (
                      <>
                        {messages.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="p-6 bg-white/5 rounded-3xl backdrop-blur-sm"
                            >
                              <ChatBubbleLeftRightIcon className="w-16 h-16 text-[#00F5D4] mx-auto" />
                            </motion.div>
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="space-y-3"
                            >
                              <p className="text-xl font-semibold text-white">How can I assist you today?</p>
                              <p className="text-sm text-white/50 max-w-[250px] mx-auto">
                                Try asking: "Add a task to prepare quarterly report" or "What's on my schedule?"
                              </p>
                            </motion.div>
                          </div>
                        ) : (
                          messages.map((msg, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={clsx(
                                "flex flex-col max-w-[85%]",
                                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                              )}
                            >
                              <div
                                className={clsx(
                                  "p-3 rounded-2xl text-sm shadow-lg",
                                  msg.role === 'user'
                                    ? "bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] text-gray-900 rounded-tr-none"
                                    : "bg-white/10 text-white rounded-tl-none backdrop-blur-sm"
                                )}
                              >
                                {msg.content}
                              </div>
                              <span className="text-xs text-white/30 mt-1">
                                {formatTime(msg.timestamp)}
                              </span>
                            </motion.div>
                          ))
                        )}
                      </>
                    )}
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-4 text-white/70 text-sm py-3"
                      >
                        <div className="flex gap-2">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 1,
                              ease: "easeInOut"
                            }}
                            className="w-2 h-2 bg-[#00F5D4] rounded-full"
                          />
                          <motion.div
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 1,
                              delay: 0.2,
                              ease: "easeInOut"
                            }}
                            className="w-2 h-2 bg-[#00F5D4] rounded-full"
                          />
                          <motion.div
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 1,
                              delay: 0.4,
                              ease: "easeInOut"
                            }}
                            className="w-2 h-2 bg-[#00F5D4] rounded-full"
                          />
                        </div>
                        <span className="font-medium bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] bg-clip-text text-transparent">
                          AI is thinking...
                        </span>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              {isAuthenticated && (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                  <div className="relative flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      disabled={isLoading || isLoadingHistory}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="w-full p-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#00F5D4] focus:ring-2 focus:ring-[#00F5D4]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!input.trim() || isLoading || isLoadingHistory}
                      className="absolute right-2 p-2.5 bg-gradient-to-r from-[#00F5D4] to-[#00D9F5] text-gray-900 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-white/30 text-center mt-2">
                    AI assistant can help with task management and productivity
                  </p>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}