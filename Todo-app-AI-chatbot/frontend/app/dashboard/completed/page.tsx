'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Task } from '@/lib/types';
import { getTasks } from '@/lib/api';
import TaskList from '@/components/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircleIcon,
  ArrowLeftIcon,
  TrashIcon,
  ClockIcon,
  TrophyIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function CompletedTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    byPriority: { high: 0, medium: 0, low: 0 }
  });

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    setLoading(true);
    try {
      const allTasks = await getTasks();
      const completedTasks = allTasks.filter(task => task.completed);
      setTasks(completedTasks);
      
      // Calculate stats
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const thisWeek = completedTasks.filter(task => 
        new Date(task.completed_at || task.updated_at) >= oneWeekAgo
      ).length;

      const thisMonth = completedTasks.filter(task => 
        new Date(task.completed_at || task.updated_at) >= oneMonthAgo
      ).length;

      const byPriority = {
        high: completedTasks.filter(t => t.priority === 'high').length,
        medium: completedTasks.filter(t => t.priority === 'medium').length,
        low: completedTasks.filter(t => t.priority === 'low').length,
      };

      setStats({
        total: completedTasks.length,
        thisWeek,
        thisMonth,
        byPriority
      });

    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      toast.error('Failed to load completed tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleTaskEdit = (task: Task) => {
    // Redirect to edit or show edit modal
    toast.success('Edit feature coming soon!');
  };

  const clearAllCompleted = () => {
    if (tasks.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear all completed tasks? This action cannot be undone.')) {
      // In a real app, you would make API calls to delete all
      toast.success(`${tasks.length} tasks cleared successfully`);
      setTasks([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Completed Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Review your accomplishments and completed work
            </p>
          </div>
        </div>

        {tasks.length > 0 && (
          <Button
            variant="outline"
            onClick={clearAllCompleted}
            className="gap-2 hover:bg-destructive/10 hover:text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
            <TrophyIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time accomplishments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <CalendarIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Recent achievements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Monthly progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tasks.length > 0 ? Math.round((stats.thisWeek / 7) * 10) / 10 : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasks per day (avg)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Distribution */}
      {tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'High', value: stats.byPriority.high, color: 'bg-rose-500' },
                { label: 'Medium', value: stats.byPriority.medium, color: 'bg-amber-500' },
                { label: 'Low', value: stats.byPriority.low, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className={`h-2 ${item.color} rounded-full mb-2`} />
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      <Card>
        <CardContent className="p-6">
          <TaskList
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
            isLoading={loading}
          />
        </CardContent>
      </Card>

      {/* Completion Tips */}
      {tasks.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-full bg-muted/50">
                <CheckCircleIcon className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No Completed Tasks Yet</h3>
                <p className="text-muted-foreground">
                  Complete some tasks to see them here. Every completed task brings you closer to your goals!
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Go to Active Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}