'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Task } from '@/lib/types';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();

  // User state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/auth');
          return;
        }
        const userDataString = localStorage.getItem('user');
        if (!userDataString) {
          localStorage.removeItem('auth_token');
          router.push('/auth');
          return;
        }
        setUser(JSON.parse(userDataString));
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/auth');
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch tasks
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setIsTasksLoading(true);
    setTasksError(null);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasksError(error instanceof Error ? error.message : 'Failed to load tasks');
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/auth');
      }
    } finally {
      setIsTasksLoading(false);
    }
  };

  const handleCreateTask = async (
    title: string,
    description: string,
    category?: string | null,
    priority?: string,
    dueDate?: Date | null
  ) => {
    try {
      const newTask = await createTask(title, description, category, priority, dueDate);
      setTasks(prev => [newTask, ...prev]);
      setShowCreateModal(false);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (
    title: string,
    description: string,
    category?: string | null,
    priority?: string,
    dueDate?: Date | null
  ) => {
    if (!editingTask) return;
    try {
      const updatedTask = await updateTask(editingTask.id, {
        title,
        description,
        category,
        priority,
        due_date: dueDate,
      });
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    overdue: tasks.filter(t => 
      !t.completed && t.due_date && new Date(t.due_date) < new Date()
    ).length,
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Welcome back, {user?.name || 'User'}. Here's your productivity overview.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="glow-effect bg-gradient-ai text-gray-900 gap-2 w-full sm:w-auto mobile-touch-area"
        >
          <PlusIcon className="h-5 w-5" />
          New Task
        </Button>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="responsive-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All tasks in your workspace</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Tasks in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <ClockIcon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl sm:text-3xl font-bold ${stats.overdue > 0 ? 'text-destructive' : ''}`}>
              {stats.overdue}
            </div>
            <p className="text-xs text-muted-foreground">Tasks past deadline</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks by title or description..."
            />
          </div>

          <TaskList
            tasks={tasks}
            searchQuery={searchQuery}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={setEditingTask}
            onNewTask={() => setShowCreateModal(true)} 
            isLoading={isTasksLoading}
            error={tasksError}
          />
        </CardContent>
      </Card>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
              onClick={() => setShowCreateModal(false)}
            />
            <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl responsive-modal">
              <TaskForm
                onSubmit={handleCreateTask}
                submitLabel="Create Task"
                onCancel={() => setShowCreateModal(false)}
                mode="create"
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
              onClick={() => setEditingTask(null)}
            />
            <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl responsive-modal">
              <TaskForm
                onSubmit={handleUpdateTask}
                initialTitle={editingTask.title}
                initialDescription={editingTask.description || ''}
                initialCategory={editingTask.category}
                initialPriority={editingTask.priority}
                initialDueDate={editingTask.due_date}
                submitLabel="Update Task"
                onCancel={() => setEditingTask(null)}
                mode="edit"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}