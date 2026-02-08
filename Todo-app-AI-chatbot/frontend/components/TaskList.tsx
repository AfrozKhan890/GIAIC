'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CATEGORIES, PRIORITIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  FunnelIcon,
  XMarkIcon,
  InboxIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

interface TaskListProps {
  tasks: Task[];
  searchQuery?: string;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: number) => void;
  onTaskEdit: (task: Task) => void;
  isLoading?: boolean;
  error?: string | null;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TaskList({
  tasks,
  searchQuery,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  isLoading = false,
  error = null,
}: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter) result = result.filter(t => t.category === categoryFilter);
    if (priorityFilter) result = result.filter(t => t.priority === priorityFilter);
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    return result.sort((a, b) => {
      const now = new Date();
      const aOverdue = !a.completed && a.due_date && new Date(a.due_date) < now;
      const bOverdue = !b.completed && b.due_date && new Date(b.due_date) < now;
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      const pOrder = { high: 0, medium: 1, low: 2 };
      const aP = pOrder[a.priority as keyof typeof pOrder] ?? 1;
      const bP = pOrder[b.priority as keyof typeof pOrder] ?? 1;
      if (aP !== bP) return aP - bP;

      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [tasks, filter, searchQuery, categoryFilter, priorityFilter]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-24 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50 text-center">
        <h3 className="text-lg font-semibold text-red-600">Failed to load tasks</h3>
        <p className="text-gray-600">{error}</p>
      </Card>
    );
  }

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-1 rounded-lg border border-gray-200">
        <div className="flex p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
          {(['all', 'active', 'completed'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                filter === type
                  ? "bg-white text-[#333333] shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-[#333333] hover:bg-white/50"
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <span className="ml-2 text-xs opacity-60">
                {taskCounts[type]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {(tasks.some(t => t.category) || tasks.some(t => t.priority)) && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-500 mr-2 flex items-center gap-1">
            <FunnelIcon className="w-4 h-4" /> Filter by:
          </span>

          {tasks.some(t => t.priority) && (
            <div className="flex flex-wrap gap-1">
              {PRIORITIES.map(pri => {
                const isActive = priorityFilter === pri.value;
                return (
                  <button
                    key={pri.value}
                    onClick={() => setPriorityFilter(isActive ? null : pri.value)}
                    className={cn(
                      "px-2 py-1 rounded-full border text-xs flex items-center gap-1 transition-colors",
                      isActive ? "bg-[#0077FF]/10 border-[#0077FF] text-[#0077FF]" : "border-transparent bg-gray-100 hover:bg-gray-200 text-gray-600"
                    )}
                  >
                    {pri.icon} {pri.label}
                  </button>
                )
              })}
            </div>
          )}

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {tasks.some(t => t.category) && (
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map(cat => {
                const isActive = categoryFilter === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(isActive ? null : cat.value)}
                    className={cn(
                      "px-2 py-1 rounded-full border text-xs flex items-center gap-1 transition-colors",
                      isActive ? "bg-[#0077FF]/10 border-[#0077FF] text-[#0077FF]" : "border-transparent bg-gray-100 hover:bg-gray-200 text-gray-600"
                    )}
                  >
                    {cat.icon} {cat.label}
                  </button>
                )
              })}
            </div>
          )}

          {(categoryFilter || priorityFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setCategoryFilter(null); setPriorityFilter(null); }}
              className="h-6 px-2 text-xs text-gray-500 hover:text-[#333333]"
            >
              <XMarkIcon className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
        </div>
      )}

      <div className="space-y-4 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onTaskUpdate}
                onDelete={onTaskDelete}
                onEdit={onTaskEdit}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="p-4 rounded-full bg-gray-100 mb-4">
                {filter === 'completed' ? (
                  <ClipboardDocumentCheckIcon className="w-12 h-12 text-gray-300" />
                ) : (
                  <InboxIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-500">No tasks found</h3>
              <p className="text-sm text-gray-400 max-w-sm mt-1">
                {searchQuery
                  ? `No matches for "${searchQuery}"`
                  : filter === 'completed'
                    ? "You haven't completed any tasks yet."
                    : "You have no tasks in this view."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}