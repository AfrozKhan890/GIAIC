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
  SparklesIcon
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

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);

    try {
      const updatedTask = await toggleComplete(task.id);
      onToggle(updatedTask);
      toast.success(updatedTask.completed ? 'Task completed! ✅' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      onDelete(task.id);
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
        className="group relative"
      >
        <div className={cn(
          "relative overflow-hidden p-5 rounded-xl transition-all duration-300 border bg-white",
          task.completed
            ? "opacity-60 border-green-200 bg-green-50"
            : "border-gray-200 shadow-sm hover:shadow-md hover:border-[#0077FF]/30"
        )}>
          {!task.completed && (
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1",
              task.priority === 'high' ? "bg-red-500" :
                task.priority === 'medium' ? "bg-yellow-500" : "bg-green-500"
            )} />
          )}

          <div className="flex items-start gap-4">
            <button
              onClick={handleToggle}
              disabled={isToggling}
              className={cn(
                "mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                task.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 bg-white hover:border-[#0077FF]"
              )}
            >
              {isToggling ? (
                <div className="w-3 h-3 border-2 border-[#0077FF] border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckIcon className={cn("w-3 h-3", task.completed ? "scale-100" : "scale-0")} />
              )}
            </button>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className={cn(
                    "text-base font-semibold transition-all",
                    task.completed
                      ? "text-gray-400 line-through"
                      : "text-[#333333]"
                  )}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={cn(
                      "text-sm line-clamp-2",
                      task.completed ? "text-gray-400" : "text-gray-600"
                    )}>
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md hover:bg-[#0077FF]/10"
                    onClick={() => onEdit(task)}
                  >
                    <PencilSquareIcon className="w-4 h-4 text-[#0077FF]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md hover:bg-red-50"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-1">
                  {task.priority && (
                    <PriorityBadge priority={task.priority} />
                  )}
                  {task.category && (
                    <CategoryBadge category={task.category} />
                  )}
                  {task.due_date && (
                    <DueDateBadge dueDate={task.due_date} completed={task.completed} />
                  )}
                </div>

                <div className="h-4 w-px bg-gray-200 mx-1 flex-shrink-0" />

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <ClockIcon className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                </div>

                {task.completed && (
                  <div className="ml-auto flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-md text-xs font-medium">
                    <SparklesIcon className="w-3 h-3" />
                    Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm"
            >
              <div className="bg-white rounded-xl p-6 space-y-6 shadow-2xl">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <TrashIcon className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#333333]">Delete this task?</h3>
                    <p className="text-sm text-gray-600">
                      Are you sure you want to delete "{task.title}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-medium shadow-lg hover:bg-red-700 transition-all flex items-center justify-center"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}