/**
 * Constants for task management features
 */

export const CATEGORIES = [
  { value: 'work', label: 'Work', color: 'blue', icon: '💼' },
  { value: 'personal', label: 'Personal', color: 'purple', icon: '👤' },
  { value: 'shopping', label: 'Shopping', color: 'green', icon: '🛒' },
  { value: 'health', label: 'Health', color: 'red', icon: '❤️' },
  { value: 'learning', label: 'Learning', color: 'yellow', icon: '📚' },
  { value: 'other', label: 'Other', color: 'gray', icon: '📌' },
] as const;

export const CATEGORY_COLORS = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  gray: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
} as const;

export const PRIORITIES = [
  { value: 'high', label: 'High', color: 'red', icon: '🔴', order: 0 },
  { value: 'medium', label: 'Medium', color: 'yellow', icon: '🟡', order: 1 },
  { value: 'low', label: 'Low', color: 'green', icon: '🟢', order: 2 },
] as const;

export const PRIORITY_COLORS = {
  red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
} as const;

export const AI_PROMPTS = [
  "Add a task to prepare quarterly report",
  "Show me overdue tasks",
  "Create a shopping list for groceries",
  "Schedule a team meeting for next week",
  "What tasks are due today?",
] as const;

export type CategoryValue = typeof CATEGORIES[number]['value'];
export type CategoryColor = keyof typeof CATEGORY_COLORS;
export type PriorityValue = typeof PRIORITIES[number]['value'];
export type PriorityColor = keyof typeof PRIORITY_COLORS;