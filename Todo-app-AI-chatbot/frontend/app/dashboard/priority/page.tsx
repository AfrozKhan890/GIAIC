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
  ArrowLeftIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FireIcon,
  FlagIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PriorityTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePriority, setActivePriority] = useState<'all' | 'high' | 'medium' | 'low'>('high');

  const [priorityStats, setPriorityStats] = useState({
    high: { total: 0, completed: 0, overdue: 0 },
    medium: { total: 0, completed: 0, overdue: 0 },
    low: { total: 0, completed: 0, overdue: 0 }
  });

  useEffect(() => {
    fetchTasksByPriority();
  }, []);

  const fetchTasksByPriority = async () => {
    setLoading(true);
    try {
      const allTasks = await getTasks();
      setTasks(allTasks);

      // Calculate priority stats
      const now = new Date();
      
      const stats = {
        high: { total: 0, completed: 0, overdue: 0 },
        medium: { total: 0, completed: 0, overdue: 0 },
        low: { total: 0, completed: 0, overdue: 0 }
      };

      allTasks.forEach(task => {
        if (task.priority === 'high') {
          stats.high.total++;
          if (task.completed) stats.high.completed++;
          else if (task.due_date && new Date(task.due_date) < now) stats.high.overdue++;
        } else if (task.priority === 'medium') {
          stats.medium.total++;
          if (task.completed) stats.medium.completed++;
          else if (task.due_date && new Date(task.due_date) < now) stats.medium.overdue++;
        } else if (task.priority === 'low') {
          stats.low.total++;
          if (task.completed) stats.low.completed++;
          else if (task.due_date && new Date(task.due_date) < now) stats.low.overdue++;
        }
      });

      setPriorityStats(stats);

    } catch (error) {
      console.error('Error fetching tasks by priority:', error);
      toast.error('Failed to load priority tasks');
    } finally {
      setLoading(false);
    }
  };

  // Add this function to filter tasks by priority
  const getFilteredTasks = () => {
    if (activePriority === 'all') return tasks;
    // return tasks.filter(task => task.priority === activePriority);
    return tasks.filter(task => task.priority && task.priority === activePriority);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    fetchTasksByPriority(); // Refresh stats
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    fetchTasksByPriority(); // Refresh stats
  };

  const handleTaskEdit = (task: Task) => {
    toast.success('Edit feature coming soon!');
  };

  const handleNewTask = () => {
    router.push('/dashboard?new=true');
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <FireIcon className="h-5 w-5 text-rose-500" />;
      case 'medium': return <FlagIcon className="h-5 w-5 text-amber-500" />;
      case 'low': return <BoltIcon className="h-5 w-5 text-emerald-500" />;
      default: return <FlagIcon className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-600 bg-rose-500/10';
      case 'medium': return 'text-amber-600 bg-amber-500/10';
      case 'low': return 'text-emerald-600 bg-emerald-500/10';
      default: return '';
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
            <h1 className="text-3xl font-bold gradient-text">Priority Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Focus on what matters most with priority-based organization
            </p>
          </div>
        </div>

        <Button
          onClick={handleNewTask}
          className="glow-effect bg-gradient-ai text-gray-900 gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Priority Task
        </Button>
      </div>

      {/* Priority Tabs */}
      <Tabs defaultValue="high" className="w-full" onValueChange={(value) => setActivePriority(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="high" className="gap-2">
            <FireIcon className="h-4 w-4" />
            High Priority
            <span className={`px-2 py-0.5 rounded-full text-xs ${priorityStats.high.total > 0 ? 'bg-rose-500/20 text-rose-600' : 'bg-muted'}`}>
              {priorityStats.high.total}
            </span>
          </TabsTrigger>
          <TabsTrigger value="medium" className="gap-2">
            <FlagIcon className="h-4 w-4" />
            Medium
            <span className={`px-2 py-0.5 rounded-full text-xs ${priorityStats.medium.total > 0 ? 'bg-amber-500/20 text-amber-600' : 'bg-muted'}`}>
              {priorityStats.medium.total}
            </span>
          </TabsTrigger>
          <TabsTrigger value="low" className="gap-2">
            <BoltIcon className="h-4 w-4" />
            Low
            <span className={`px-2 py-0.5 rounded-full text-xs ${priorityStats.low.total > 0 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-muted'}`}>
              {priorityStats.low.total}
            </span>
          </TabsTrigger>
        </TabsList>

        {['high', 'medium', 'low'].map((priority) => {
          const stats = priorityStats[priority as keyof typeof priorityStats];
          
          return (
            <TabsContent key={priority} value={priority} className="space-y-6">
              {/* Priority Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    {getPriorityIcon(priority)}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${getPriorityColor(priority).split(' ')[0]}`}>
                      {stats.total}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {priority === 'high' ? 'Urgent tasks' : 
                       priority === 'medium' ? 'Important tasks' : 
                       'Nice-to-have tasks'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-600">
                      {stats.completed}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.total > 0 
                        ? `${Math.round((stats.completed / stats.total) * 100)}% done`
                        : 'No tasks'
                      }
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
                      {stats.overdue > 0 ? 'Requires attention' : 'All on track'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Priority Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {priority === 'high' ? '🔥 High Priority Tasks' :
                     priority === 'medium' ? '🚩 Medium Priority Tasks' :
                     '⚡ Low Priority Tasks'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {priority === 'high' 
                      ? 'These tasks require immediate attention. They are critical to your goals and should be completed as soon as possible. Focus here first!'
                      : priority === 'medium'
                      ? 'Important tasks that contribute to your goals. Schedule time for these after high-priority items are handled.'
                      : 'Tasks that would be nice to complete but aren\'t urgent. Work on these when higher priority tasks are done.'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Task List for this Priority */}
              <Card>
                <CardContent className="p-6">
                  <TaskList
                    tasks={getFilteredTasks()}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                    onTaskEdit={handleTaskEdit}
                    onNewTask={handleNewTask}
                    isLoading={loading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Priority Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Priority Management Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FireIcon className="h-5 w-5 text-rose-500" />
                <h4 className="font-semibold">High Priority</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Do these tasks first thing in the morning</li>
                <li>• Set specific deadlines</li>
                <li>• Eliminate distractions while working</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FlagIcon className="h-5 w-5 text-amber-500" />
                <h4 className="font-semibold">Medium Priority</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Schedule specific time blocks</li>
                <li>• Batch similar tasks together</li>
                <li>• Review progress weekly</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BoltIcon className="h-5 w-5 text-emerald-500" />
                <h4 className="font-semibold">Low Priority</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Do these during downtime</li>
                <li>• Delegate when possible</li>
                <li>• Review monthly for relevance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}