'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Task } from '@/lib/types';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  SparklesIcon, 
  ChartBarIcon, 
  ClockIcon, 
  XMarkIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  CalendarIcon
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

  // Check auth
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
        console.error('Error checking authentication:', error);
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
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setShowCreateModal(false);
      toast.success('Task created successfully!', {
        style: {
          background: 'var(--color-pistachio-green)',
          color: 'white',
          border: '1px solid var(--color-border)',
        },
      });
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
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditingTask(null);
      toast.success('Task updated successfully!', {
        style: {
          background: 'var(--color-soft-lavender)',
          color: 'white',
          border: '1px solid var(--color-border)',
        },
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pistachio-green/20 to-soft-lavender/20"></div>
          <p className="text-muted-foreground">Loading your biodigital workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn p-2">
      {/* Header Section - Biodigital Style */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-pistachio-green/20 to-soft-lavender/20 border border-border/30">
              <SparklesIcon className="w-6 h-6 text-pistachio-green dark:text-soft-lavender" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-warm-beige-dark to-pistachio-green dark:from-soft-lavender dark:to-deep-blue bg-clip-text text-transparent">
                Welcome back, {user?.name || 'Genius'}!
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <BoltIcon className="w-4 h-4" />
                Your AI-powered productivity dashboard
              </p>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)} 
          size="lg" 
          className="group shadow-lg shadow-primary/20 hover:shadow-primary/30 bg-gradient-to-r from-pistachio-green to-soft-lavender hover:from-pistachio-green-dark hover:to-soft-lavender-dark text-white border-0 transition-all duration-300 hover:scale-[1.02]"
        >
          <PlusIcon className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          New Smart Task
        </Button>
      </div>

      {/* Stats Cards - Organic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-warm-beige/10 to-transparent dark:from-charcoal/20 dark:to-transparent border-border/30 hover:border-pistachio-green/50 transition-colors duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">Total Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-warm-beige/20 dark:bg-charcoal/30 group-hover:scale-110 transition-transform duration-300">
              <ChartBarIcon className="h-5 w-5 text-warm-beige-dark dark:text-warm-beige" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-warm-beige-dark to-pistachio-green dark:from-warm-beige dark:to-pistachio-green bg-clip-text text-transparent">
              {tasks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-3 h-3" />
              AI-optimized workflow
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pistachio-green/10 to-transparent dark:from-deep-blue/20 dark:to-transparent border-border/30 hover:border-pistachio-green/50 transition-colors duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">Active Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-pistachio-green/20 dark:bg-deep-blue/30 group-hover:scale-110 transition-transform duration-300">
              <BoltIcon className="h-5 w-5 text-pistachio-green dark:text-soft-lavender" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-pistachio-green to-soft-lavender dark:from-pistachio-green dark:to-deep-blue bg-clip-text text-transparent">
              {tasks.filter(t => !t.completed).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              In progress
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-soft-lavender/10 to-transparent dark:from-charcoal/20 dark:to-transparent border-border/30 hover:border-soft-lavender/50 transition-colors duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">Completed</CardTitle>
            <div className="p-2 rounded-lg bg-soft-lavender/20 dark:bg-charcoal/30 group-hover:scale-110 transition-transform duration-300">
              <CheckCircleIcon className="h-5 w-5 text-soft-lavender dark:text-warm-beige" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-soft-lavender to-deep-blue dark:from-soft-lavender dark:to-deep-blue bg-clip-text text-transparent">
              {tasks.filter(t => t.completed).length}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              All-time achievement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Task List Area */}
      <Card className="border-border/30 bg-gradient-to-b from-background to-background/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Smart Task List</h2>
                <p className="text-sm text-muted-foreground">AI-sorted by priority & deadline</p>
              </div>
              <div className="text-xs px-3 py-1 rounded-full bg-pistachio-green/10 text-pistachio-green border border-pistachio-green/20">
                {tasks.filter(t => !t.completed).length} pending
              </div>
            </div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks with AI assistance..."
            />
          </div>

          <TaskList
            tasks={tasks}
            searchQuery={searchQuery}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={setEditingTask}
            isLoading={isTasksLoading}
            error={tasksError}
          />
        </CardContent>
      </Card>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-gradient-to-b from-card to-card/90 border border-border/30 rounded-3xl shadow-2xl shadow-deep-blue/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-pistachio-green to-soft-lavender bg-clip-text text-transparent">
                    Create Smart Task
                  </h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    AI-assisted task creation
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full hover:bg-muted/50 border border-border/30"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
              <TaskForm
                onSubmit={handleCreateTask}
                submitLabel="Create with AI"
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-gradient-to-b from-card to-card/90 border border-border/30 rounded-3xl shadow-2xl shadow-soft-lavender/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-soft-lavender to-deep-blue bg-clip-text text-transparent">
                    Edit Task
                  </h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    Optimize your workflow
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingTask(null)}
                  className="rounded-full hover:bg-muted/50 border border-border/30"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
              <TaskForm
                onSubmit={handleUpdateTask}
                initialTitle={editingTask.title}
                initialDescription={editingTask.description || ''}
                initialCategory={editingTask.category}
                initialPriority={editingTask.priority}
                initialDueDate={editingTask.due_date}
                submitLabel="Update with AI"
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}