/**
 * TypeScript type definitions for TaskSync AI
 */

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  category: string | null;
  priority: string | null;
  due_date: string | null;
  order: number;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  tokens_used: number;
}