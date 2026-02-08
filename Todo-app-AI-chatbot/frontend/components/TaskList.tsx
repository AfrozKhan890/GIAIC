'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CATEGORIES, CATEGORY_COLORS, PRIORITIES, PRIORITY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  FunnelIcon,
  XMarkIcon,
  InboxIcon,
  ClipboardDocumentCheckIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface TaskListProps {
  tasks: Task[];
  searchQuery?: string;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: number) => void;
  onTaskEdit: (task: Task) => void;
  onNewTask?: () => void;
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
  onNewTask,
  isLoading = false,
  error = null,
}: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Search filter
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter(t => t.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter) {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // Status filter
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    // Sort: overdue first, then by priority, then by due date
    return result.sort((a, b) => {
      const now = new Date();
      const aOverdue = !a.completed && a.due_date && new Date(a.due_date) < now;
      const bOverdue = !b.completed && b.due_date && new Date(b.due_date) < now;
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 1;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 1;
      if (aPriority !== bPriority) return aPriority - bPriority;

      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [tasks, filter, searchQuery, categoryFilter, priorityFilter]);

  // Task statistics
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    overdue: tasks.filter(t => 
      !t.completed && t.due_date && new Date(t.due_date) < new Date()
    ).length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
  }), [tasks]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton for filter bar */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
            <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
          </div>
        </Card>

        {/* Skeleton for tasks */}
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 bg-muted rounded-lg animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                    <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-6 border-destructive/50 bg-destructive/5">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <XMarkIcon className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-destructive">Failed to Load Tasks</h3>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <span>Retry</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold gradient-text">Your Tasks</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-muted-foreground">
              {filteredTasks.length} of {tasks.length} tasks
            </span>
            {taskCounts.overdue > 0 && (
              <span className="text-sm font-medium text-destructive">
                {taskCounts.overdue} overdue
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {onNewTask && (
            <Button
              onClick={onNewTask}
              className="glow-effect bg-gradient-ai text-gray-900 gap-2"
              size="sm"
            >
              <PlusIcon className="h-4 w-4" />
              New Task
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "gap-2 transition-all",
                showFilters && "bg-accent text-accent-foreground"
              )}
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            {/* Status Filter Tabs */}
            <div className="flex p-1 bg-muted rounded-lg">
              {(['all', 'active', 'completed'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                    filter === type
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    filter === type ? "bg-primary/10 text-primary" : "bg-muted-foreground/20"
                  )}>
                    {taskCounts[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(categoryFilter || priorityFilter || filter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategoryFilter(null);
                setPriorityFilter(null);
                setFilter('all');
              }}
              className="gap-2 text-sm"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
              Clear All
            </Button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border space-y-6"
          >
            {/* Priority Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Priority</label>
                <span className="text-xs text-muted-foreground">
                  {priorityFilter ? 'Filtered' : 'All priorities'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map(pri => {
                  const isActive = priorityFilter === pri.value;
                  const count = tasks.filter(t => t.priority === pri.value).length;
                  
                  return (
                    <button
                      key={pri.value}
                      onClick={() => setPriorityFilter(isActive ? null : pri.value)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm flex items-center gap-3 transition-all",
                        isActive
                          ? `${PRIORITY_COLORS[pri.color]} border-primary shadow-sm`
                          : "border-transparent bg-muted hover:bg-muted/80"
                      )}
                    >
                      <span className="text-lg">{pri.icon}</span>
                      <span>{pri.label}</span>
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        isActive ? "bg-primary/20" : "bg-muted-foreground/20"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Category</label>
                <span className="text-xs text-muted-foreground">
                  {categoryFilter ? 'Filtered' : 'All categories'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => {
                  const isActive = categoryFilter === cat.value;
                  const count = tasks.filter(t => t.category === cat.value).length;
                  
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategoryFilter(isActive ? null : cat.value)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm flex items-center gap-3 transition-all",
                        isActive
                          ? `${CATEGORY_COLORS[cat.color]} border-primary shadow-sm`
                          : "border-transparent bg-muted hover:bg-muted/80"
                      )}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        isActive ? "bg-primary/20" : "bg-muted-foreground/20"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-card border">
                <div className="text-2xl font-bold">{taskCounts.all}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="p-3 rounded-lg bg-card border">
                <div className="text-2xl font-bold text-emerald-600">{taskCounts.active}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="p-3 rounded-lg bg-card border">
                <div className="text-2xl font-bold text-blue-600">{taskCounts.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="p-3 rounded-lg bg-card border">
                <div className="text-2xl font-bold text-rose-600">{taskCounts.highPriority}</div>
                <div className="text-xs text-muted-foreground">High Priority</div>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TaskItem
                  task={task}
                  onToggle={onTaskUpdate}
                  onDelete={onTaskDelete}
                  onEdit={onTaskEdit}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-16 text-center space-y-6"
            >
              <div className="inline-flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted/50">
                  {filter === 'completed' ? (
                    <ClipboardDocumentCheckIcon className="h-16 w-16 text-muted-foreground/50" />
                  ) : searchQuery ? (
                    <InboxIcon className="h-16 w-16 text-muted-foreground/50" />
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center">
                      <div className="text-4xl">📝</div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="text-xl font-semibold text-foreground">
                    {searchQuery
                      ? `No matches found for "${searchQuery}"`
                      : filter === 'completed'
                        ? "No completed tasks yet"
                        : filter === 'active'
                          ? "All caught up!"
                          : "No tasks yet"}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm">
                    {searchQuery
                      ? "Try a different search term or clear the search"
                      : filter === 'completed'
                        ? "Complete some tasks to see them here"
                        : filter === 'active'
                          ? "Create a new task to get started"
                          : "Create your first task to begin organizing"}
                  </p>
                </div>

                {onNewTask && (
                  <Button
                    onClick={onNewTask}
                    className="glow-effect bg-gradient-ai text-gray-900 gap-2 mt-4"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Create Your First Task
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      {filteredTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-4 border-t border-border"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Showing {filteredTasks.length} tasks</span>
              {priorityFilter && (
                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                  {PRIORITIES.find(p => p.value === priorityFilter)?.label} Priority
                </span>
              )}
              {categoryFilter && (
                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                  {CATEGORIES.find(c => c.value === categoryFilter)?.label}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{taskCounts.active} active</span>
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{taskCounts.completed} completed</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}