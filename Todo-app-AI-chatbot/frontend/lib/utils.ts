import { clsx, type ClassValue } from "clsx";
import { Task } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDaysUntil(dueDate: string | Date): number {
  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'high': return 'text-red-600 dark:text-red-400';
    case 'medium': return 'text-yellow-600 dark:text-yellow-400';
    case 'low': return 'text-green-600 dark:text-green-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
}

export function getCategoryColor(category: string): string {
  switch (category?.toLowerCase()) {
    case 'work': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30';
    case 'personal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30';
    case 'shopping': return 'bg-green-100 text-green-800 dark:bg-green-900/30';
    case 'health': return 'bg-red-100 text-red-800 dark:bg-red-900/30';
    case 'learning': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30';
    case 'fitness': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700';
  }
}

export function filterTasks(tasks: Task[], searchQuery: string): Task[] {
  if (!searchQuery.trim()) return tasks;
  
  const query = searchQuery.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(query) ||
    task.description?.toLowerCase().includes(query) ||
    task.category?.toLowerCase().includes(query) ||
    task.priority?.toLowerCase().includes(query)
  );
}

export function sortTasks(tasks: Task[], sortBy: string = 'created_at', sortOrder: string = 'desc'): Task[] {
  return [...tasks].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Task];
    let bValue: any = b[sortBy as keyof Task];

    if (sortBy === 'due_date') {
      aValue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      bValue = b.due_date ? new Date(b.due_date).getTime() : Infinity;
    }

    if (aValue === bValue) return 0;
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateTaskInsights(tasks: Task[]): string[] {
  const insights: string[] = [];
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  if (pendingTasks.length > 10) {
    insights.push(`You have ${pendingTasks.length} pending tasks. Consider prioritizing the most important ones.`);
  }
  
  if (completedTasks.length > 0) {
    insights.push(`Great work! You've completed ${completedTasks.length} tasks.`);
  }
  
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
  if (highPriorityTasks.length > 0) {
    insights.push(`You have ${highPriorityTasks.length} high-priority tasks that need attention.`);
  }
  
  const today = new Date();
  const overdueTasks = pendingTasks.filter(task => {
    if (!task.due_date) return false;
    return new Date(task.due_date) < today;
  });
  
  if (overdueTasks.length > 0) {
    insights.push(`You have ${overdueTasks.length} overdue tasks.`);
  }
  
  return insights;
}