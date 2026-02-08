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
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';

export default function TodayTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    overdue: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const fetchTodayTasks = async () => {
    setLoading(true);
    try {
      const allTasks = await getTasks();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get tasks due today or overdue
      const todayTasks = allTasks.filter(task => {
        if (task.completed) return false;
        if (!task.due_date) return false;
        
        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);
        
        // Include overdue tasks and tasks due today
        return dueDate <= today;
      });

      // Sort: overdue first, then by priority
      const sortedTasks = todayTasks.sort((a, b) => {
        const aDue = a.due_date ? new Date(a.due_date) : new Date();
        const bDue = b.due_date ? new Date(b.due_date) : new Date();
        
        // Overdue tasks first
        const aOverdue = aDue < today && !a.completed;
        const bOverdue = bDue < today && !b.completed;
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        
        // Then by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 1;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 1;
        if (aPriority !== bPriority) return aPriority - bPriority;
        
        // Then by due date
        return aDue.getTime() - bDue.getTime();
      });

      setTasks(sortedTasks);

      // Calculate stats
      const overdue = todayTasks.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate < today && !task.completed;
      }).length;

      const completed = todayTasks.filter(task => task.completed).length;
      const pending = todayTasks.filter(task => !task.completed).length;

      setStats({
        total: todayTasks.length,
        overdue,
        completed,
        pending
      });

    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      toast.error('Failed to load today\'s tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    fetchTodayTasks(); // Refresh stats
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    fetchTodayTasks(); // Refresh stats
  };

  const handleTaskEdit = (task: Task) => {
    // In a real app, you would show edit modal
    toast.success('Edit feature coming soon!');
  };

  const handleNewTask = () => {
    router.push('/dashboard?new=true');
  };

  const getDueStatus = (dueDate: string | null) => {
    if (!dueDate) return '';
    
    const date = parseISO(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isToday(date)) return 'Due Today';
    if (isTomorrow(date)) return 'Due Tomorrow';
    
    const diff = date.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 1) return 'Due Tomorrow';
    return `Due in ${days} days`;
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
            <h1 className="text-3xl font-bold gradient-text">Today's Agenda</h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(), 'EEEE, MMMM dd, yyyy')}
            </p>
          </div>
        </div>

        <Button
          onClick={handleNewTask}
          className="glow-effect bg-gradient-ai text-gray-900 gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Task for Today
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total for Today</CardTitle>
            <CalendarIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Tasks scheduled today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <ExclamationTriangleIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stats.overdue > 0 ? 'text-rose-600' : ''}`}>
              {stats.overdue}
            </div>
            <p className="text-xs text-muted-foreground">
              Past deadline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <ClockIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Finished today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Completion Rate</span>
                <span className="font-bold">
                  {Math.round((stats.completed / stats.total) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-ai transition-all duration-500"
                  style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{stats.completed} completed</span>
                <span>{stats.pending} remaining</span>
              </div>
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
            onNewTask={handleNewTask}
            isLoading={loading}
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      {tasks.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-full bg-muted/50">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Nothing Due Today</h3>
                <p className="text-muted-foreground">
                  You're all caught up! No tasks are due today. Enjoy your productive day or add new tasks to stay ahead.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="gap-2"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  View All Tasks
                </Button>
                <Button
                  onClick={handleNewTask}
                  className="gap-2 glow-effect bg-gradient-ai text-gray-900"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}