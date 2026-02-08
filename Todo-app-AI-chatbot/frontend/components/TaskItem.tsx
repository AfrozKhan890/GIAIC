'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/lib/types';
import { toggleComplete } from '@/lib/api';
import CategoryBadge from './CategoryBadge';
import PriorityBadge from './PriorityBadge';
import DueDateBadge from './DueDateBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggle: (updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);

    try {
      const updatedTask = await toggleComplete(task.id);
      onToggle(updatedTask);
      toast.success(updatedTask.completed ? 'Task completed! 🎉' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task status');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      onDelete(task.id);
      setShowDeleteConfirm(false);
    } catch (err) {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group"
      >
        <Card className={cn(
          "overflow-hidden transition-all duration-300 relative",
          task.completed && "opacity-60"
        )}>
          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggle}
                disabled={isToggling}
                className={cn(
                  "mt-1 w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                  task.completed
                    ? "bg-gradient-ai border-transparent text-gray-900 shadow-lg"
                    : "border-border hover:border-primary hover:bg-primary/10"
                )}
              >
                {isToggling ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                ) : task.completed ? (
                  <CheckIcon className="w-4 h-4" />
                ) : null}
              </motion.button>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h3 className={cn(
                      "text-lg font-semibold leading-tight",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={cn(
                        "text-sm text-muted-foreground line-clamp-2",
                        task.completed && "opacity-50"
                      )}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Actions - Fixed: Always visible on hover */}
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 shrink-0"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-primary/10"
                      onClick={() => onEdit(task)}
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {task.priority && (
                    <PriorityBadge priority={task.priority} />
                  )}
                  {task.category && (
                    <CategoryBadge category={task.category} />
                  )}
                  {task.due_date && (
                    <DueDateBadge dueDate={task.due_date} completed={task.completed} />
                  )}
                  
                  <div className="h-4 w-px bg-border mx-1" />
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ClockIcon className="h-3.5 w-3.5" />
                    <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                  </div>

                  {task.completed && (
                    <div className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">
                      <SparklesIcon className="h-3 w-3" />
                      Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md"
            >
              <Card className="relative overflow-hidden">
                <div className="p-6 space-y-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                      <TrashIcon className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Delete Task?</h3>
                      <p className="text-muted-foreground">
                        Are you sure you want to delete "{task.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Task'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}