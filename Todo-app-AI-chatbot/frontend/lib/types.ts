export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
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

export interface TaskFilters {
  completed?: boolean;
  category?: string;
  priority?: string;
  search?: string;
  sortBy?: 'created_at' | 'due_date' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  taskId?: number;
}

export interface AIResponse {
  message: string;
  suggestedTasks?: Partial<Task>[];
  insights?: string[];
  actions?: Array<{
    type: 'create_task' | 'update_task' | 'delete_task' | 'reminder';
    data: any;
  }>;
}