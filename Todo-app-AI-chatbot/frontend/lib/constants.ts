// SmartDo Task Categories
export const CATEGORIES = [
  { value: 'work', label: 'Work', color: 'blue', icon: '💼' },
  { value: 'personal', label: 'Personal', color: 'purple', icon: '👤' },
  { value: 'shopping', label: 'Shopping', color: 'green', icon: '🛒' },
  { value: 'health', label: 'Health', color: 'red', icon: '❤️' },
  { value: 'learning', label: 'Learning', color: 'orange', icon: '📚' },
  { value: 'fitness', label: 'Fitness', color: 'teal', icon: '💪' },
  { value: 'other', label: 'Other', color: 'gray', icon: '📌' },
] as const;

// SmartDo Theme Colors
export const CATEGORY_COLORS = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
  green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  red: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
  orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
  teal: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300',
  gray: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300',
} as const;

// SmartDo Task Priorities
export const PRIORITIES = [
  { value: 'high', label: 'High Priority', color: 'red', icon: '🔴', order: 0 },
  { value: 'medium', label: 'Medium Priority', color: 'yellow', icon: '🟡', order: 1 },
  { value: 'low', label: 'Low Priority', color: 'green', icon: '🟢', order: 2 },
] as const;

export const PRIORITY_COLORS = {
  red: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
  green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
} as const;

// SmartDo Status Types
export const STATUS_TYPES = {
  pending: { label: 'Pending', color: 'yellow', icon: '⏳' },
  in_progress: { label: 'In Progress', color: 'blue', icon: '🚀' },
  completed: { label: 'Completed', color: 'green', icon: '✅' },
  cancelled: { label: 'Cancelled', color: 'gray', icon: '❌' },
} as const;

// SmartDo App Constants
export const APP_CONSTANTS = {
  APP_NAME: 'SmartDo',
  APP_TAGLINE: 'Smart tasks, done smarter',
  APP_DESCRIPTION: 'AI-powered task management for modern productivity',
  APP_VERSION: '1.0.0',
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const;

// SmartDo Theme Colors
export const THEME_COLORS = {
  primary: '#0077FF', // SmartDo AI Blue
  secondary: '#FFFFFF', // Clean White
  accent: '#FF6B35', // Energetic Orange
  text: '#333333', // Dark Grey
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  info: '#3B82F6', // Blue
  muted: '#6B7280', // Gray
  border: '#E5E7EB', // Light Gray
} as const;

export type CategoryValue = typeof CATEGORIES[number]['value'];
export type CategoryColor = keyof typeof CATEGORY_COLORS;
export type PriorityValue = typeof PRIORITIES[number]['value'];
export type PriorityColor = keyof typeof PRIORITY_COLORS;