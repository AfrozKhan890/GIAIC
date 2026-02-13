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
  ChevronDownIcon,
  ChevronUpIcon,
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

  // Count active filters
  const activeFilterCount = [
    filter !== 'all',
    categoryFilter !== null,
    priorityFilter !== null
  ].filter(Boolean).length;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Skeleton for filter bar */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="h-8 w-24 sm:w-32 bg-muted rounded-lg animate-pulse" />
            <div className="h-8 w-20 sm:w-24 bg-muted rounded-lg animate-pulse" />
          </div>
        </Card>

        {/* Skeleton for tasks */}
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 bg-muted rounded-lg animate-pulse shrink-0" />
                <div className="flex-1 w-full space-y-2 sm:space-y-3">
                  <div className="h-5 sm:h-6 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-5 sm:h-6 w-16 sm:w-20 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 sm:h-6 w-20 sm:w-24 bg-muted rounded-full animate-pulse" />
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
      <Card className="p-4 sm:p-6 border-destructive/50 bg-destructive/5">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-destructive">Failed to Load Tasks</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
            className="gap-2 text-sm"
          >
            <span>Retry</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Stats - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h2 className="text-lg sm:text-xl font-bold gradient-text">Your Tasks</h2>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1 sm:mt-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {filteredTasks.length} of {tasks.length} tasks
            </span>
            {taskCounts.overdue > 0 && (
              <span className="text-xs sm:text-sm font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                {taskCounts.overdue} overdue
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onNewTask && (
            <Button
              onClick={onNewTask}
              className="glow-effect bg-gradient-ai text-gray-900 gap-1 sm:gap-2 flex-1 sm:flex-none text-sm sm:text-base"
              size="default"
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sm:inline">New Task</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls - Completely Responsive */}
      <Card className="p-3 sm:p-4">
        {/* Top Bar - Always visible */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowFilters(!showFilters);
                if (window.innerWidth < 640) {
                  setMobileFilterOpen(!mobileFilterOpen);
                }
              }}
              className={cn(
                "gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-none",
                showFilters && "bg-accent text-accent-foreground"
              )}
            >
              <AdjustmentsHorizontalIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs bg-primary text-primary-foreground rounded-full">
                  {activeFilterCount}
                </span>
              )}
              {showFilters ? (
                <ChevronUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-auto sm:ml-1" />
              ) : (
                <ChevronDownIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-auto sm:ml-1" />
              )}
            </Button>

            {/* Status Filter Tabs - Horizontal Scroll on Mobile */}
            <div className="flex-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <div className="flex p-0.5 sm:p-1 bg-muted rounded-lg min-w-max sm:min-w-0">
                {(['all', 'active', 'completed'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={cn(
                      "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1 sm:gap-2",
                      filter === type
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <span className="capitalize">{type}</span>
                    <span className={cn(
                      "text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded",
                      filter === type ? "bg-primary/10 text-primary" : "bg-muted-foreground/20"
                    )}>
                      {taskCounts[type]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters Button - Desktop */}
          {(categoryFilter || priorityFilter || filter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategoryFilter(null);
                setPriorityFilter(null);
                setFilter('all');
              }}
              className="hidden sm:flex gap-2 text-xs sm:text-sm"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
              Clear All
            </Button>
          )}
        </div>

        {/* Advanced Filters Panel - Fully Responsive */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border"
            >
              <div className="space-y-4 sm:space-y-6">
                {/* Mobile Clear Filters Button */}
                {(categoryFilter || priorityFilter || filter !== 'all') && (
                  <div className="block sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCategoryFilter(null);
                        setPriorityFilter(null);
                        setFilter('all');
                      }}
                      className="w-full gap-2 text-sm"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Clear All Filters
                    </Button>
                  </div>
                )}

                {/* Priority Filter */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs sm:text-sm font-medium">Priority</label>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      {priorityFilter ? `Filtered: ${PRIORITIES.find(p => p.value === priorityFilter)?.label}` : 'All priorities'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    {PRIORITIES.map(pri => {
                      const isActive = priorityFilter === pri.value;
                      const count = tasks.filter(t => t.priority === pri.value).length;
                      
                      return (
                        <button
                          key={pri.value}
                          onClick={() => setPriorityFilter(isActive ? null : pri.value)}
                          className={cn(
                            "px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm flex items-center gap-1.5 sm:gap-3 transition-all w-full sm:w-auto",
                            isActive
                              ? `${PRIORITY_COLORS[pri.color]} border-primary shadow-sm`
                              : "border-transparent bg-muted hover:bg-muted/80"
                          )}
                        >
                          <span className="text-base sm:text-lg">{pri.icon}</span>
                          <span className="flex-1 sm:flex-none text-left">{pri.label}</span>
                          <span className={cn(
                            "text-[10px] sm:text-xs px-1.5 py-0.5 rounded ml-auto sm:ml-0",
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
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs sm:text-sm font-medium">Category</label>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      {categoryFilter ? `Filtered: ${CATEGORIES.find(c => c.value === categoryFilter)?.label}` : 'All categories'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    {CATEGORIES.map(cat => {
                      const isActive = categoryFilter === cat.value;
                      const count = tasks.filter(t => t.category === cat.value).length;
                      
                      return (
                        <button
                          key={cat.value}
                          onClick={() => setCategoryFilter(isActive ? null : cat.value)}
                          className={cn(
                            "px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm flex items-center gap-1.5 sm:gap-3 transition-all w-full sm:w-auto",
                            isActive
                              ? `${CATEGORY_COLORS[cat.color]} border-primary shadow-sm`
                              : "border-transparent bg-muted hover:bg-muted/80"
                          )}
                        >
                          <span className="text-base sm:text-lg">{cat.icon}</span>
                          <span className="flex-1 sm:flex-none text-left">{cat.label}</span>
                          <span className={cn(
                            "text-[10px] sm:text-xs px-1.5 py-0.5 rounded ml-auto sm:ml-0",
                            isActive ? "bg-primary/20" : "bg-muted-foreground/20"
                          )}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats - Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <div className="p-2 sm:p-3 rounded-lg bg-card border">
                    <div className="text-lg sm:text-2xl font-bold">{taskCounts.all}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-card border">
                    <div className="text-lg sm:text-2xl font-bold text-emerald-600">{taskCounts.active}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Active</div>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-card border">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{taskCounts.completed}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-card border">
                    <div className="text-lg sm:text-2xl font-bold text-rose-600">{taskCounts.highPriority}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">High Priority</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Task List */}
      <div className="space-y-3 sm:space-y-4">
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
              className="py-8 sm:py-16 text-center space-y-4 sm:space-y-6"
            >
              <div className="inline-flex flex-col items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-full bg-muted/50">
                  {filter === 'completed' ? (
                    <ClipboardDocumentCheckIcon className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
                  ) : searchQuery ? (
                    <InboxIcon className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
                  ) : (
                    <div className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl">📝</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1 sm:space-y-2 max-w-xs sm:max-w-sm mx-auto px-4">
                  <h3 className="text-base sm:text-xl font-semibold text-foreground">
                    {searchQuery
                      ? `No matches found for "${searchQuery}"`
                      : filter === 'completed'
                        ? "No completed tasks yet"
                        : filter === 'active'
                          ? "All caught up!"
                          : "No tasks yet"}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground">
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
                    size="sm"
                    className="glow-effect bg-gradient-ai text-gray-900 gap-2 mt-2 sm:mt-4 text-sm sm:text-base"
                  >
                    <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    Create Your First Task
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats - Responsive */}
      {filteredTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-3 sm:pt-4 border-t border-border"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span>Showing {filteredTasks.length} tasks</span>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {priorityFilter && (
                  <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary/10 text-primary text-[10px] sm:text-xs">
                    {PRIORITIES.find(p => p.value === priorityFilter)?.label} Priority
                  </span>
                )}
                {categoryFilter && (
                  <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary/10 text-primary text-[10px] sm:text-xs">
                    {CATEGORIES.find(c => c.value === categoryFilter)?.label}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] sm:text-xs">{taskCounts.active} active</span>
              </span>
              <span className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] sm:text-xs">{taskCounts.completed} completed</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
