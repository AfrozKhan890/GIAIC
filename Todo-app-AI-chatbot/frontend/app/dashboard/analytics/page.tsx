'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Dummy analytics data
  const analyticsData = {
    overview: {
      totalTasks: 42,
      completedTasks: 28,
      completionRate: 67,
      productivityScore: 85,
      avgCompletionTime: '2.3 days',
      streak: 7
    },
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      completed: [3, 5, 4, 6, 8, 2, 1],
      created: [2, 4, 3, 5, 6, 1, 2]
    },
    categories: [
      { name: 'Work', count: 18, color: 'bg-blue-500' },
      { name: 'Personal', count: 12, color: 'bg-purple-500' },
      { name: 'Shopping', count: 6, color: 'bg-green-500' },
      { name: 'Health', count: 4, color: 'bg-red-500' },
      { name: 'Learning', count: 2, color: 'bg-yellow-500' }
    ],
    priorities: [
      { name: 'High', count: 8, color: 'bg-rose-500' },
      { name: 'Medium', count: 22, color: 'bg-amber-500' },
      { name: 'Low', count: 12, color: 'bg-emerald-500' }
    ],
    performance: {
      efficiency: 78,
      consistency: 85,
      timeliness: 72,
      quality: 88
    },
    recentAchievements: [
      { title: '7 Day Streak', description: 'Consistent task completion', icon: '🔥' },
      { title: 'Early Bird', description: 'Completed 5 tasks before 9 AM', icon: '🌅' },
      { title: 'Priority Master', description: 'Cleared all high-priority tasks', icon: '🎯' },
      { title: 'Weekend Warrior', description: 'Productive on weekends', icon: '⚔️' }
    ]
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
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
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full mobile-touch-area"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Analytics Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Insights and performance metrics for your productivity journey
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>Last updated: Today</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="responsive-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{analyticsData.overview.totalTasks}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {analyticsData.overview.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.overview.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
            <TrophyIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600">
              {analyticsData.overview.productivityScore}
            </div>
            <p className="text-xs text-muted-foreground">Out of 100 points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <SparklesIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-rose-600">
              {analyticsData.overview.streak} days
            </div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span className="text-sm">Tasks Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted-foreground/30 rounded-full" />
                  <span className="text-sm">Tasks Created</span>
                </div>
              </div>
              
              <div className="h-32 sm:h-48 flex items-end gap-1 sm:gap-2">
                {analyticsData.weekly.labels.map((day, index) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-1">
                      <div 
                        className="w-3/4 sm:w-2/3 bg-primary rounded-t"
                        style={{ height: `${analyticsData.weekly.completed[index] * 10}px` }}
                      />
                      <div 
                        className="w-3/4 sm:w-2/3 bg-muted-foreground/30 rounded-t"
                        style={{ height: `${analyticsData.weekly.created[index] * 10}px` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(analyticsData.performance).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{key}</span>
                    <span className="font-bold">{value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-ai transition-all duration-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {analyticsData.categories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${category.color} rounded-full`} />
                      <span>{category.name}</span>
                    </div>
                    <span className="font-bold">{category.count} tasks</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${category.color} transition-all duration-500`}
                      style={{ 
                        width: `${(category.count / analyticsData.overview.totalTasks) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {analyticsData.priorities.map((priority) => (
                <div key={priority.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${priority.color} rounded-full`} />
                      <span>{priority.name} Priority</span>
                    </div>
                    <span className="font-bold">{priority.count} tasks</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${priority.color} transition-all duration-500`}
                      style={{ 
                        width: `${(priority.count / analyticsData.overview.totalTasks) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {analyticsData.recentAchievements.map((achievement) => (
              <div 
                key={achievement.title}
                className="p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-xl sm:text-2xl">{achievement.icon}</div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base truncate">{achievement.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold">AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <ArrowTrendingUpIcon className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-sm sm:text-base">Productivity Trend</h4>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your productivity has increased by 15% compared to last week. 
                You're most productive on Wednesdays and Fridays.
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <ClockIcon className="h-5 w-5 text-emerald-500" />
                <h4 className="font-semibold text-sm sm:text-base">Time Management</h4>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Average task completion time is 2.3 days. 
                Consider breaking larger tasks into smaller subtasks for better time management.
              </p>
            </div>

            <div className="p-3 sm:p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <CheckCircleIcon className="h-5 w-5 text-amber-500" />
                <h4 className="font-semibold text-sm sm:text-base">Recommendation</h4>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Try scheduling high-priority tasks in the morning when your focus is highest. 
                Your completion rate for morning tasks is 40% higher.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="text-center text-xs sm:text-sm text-muted-foreground py-4">
        <p>
          Analytics are updated daily. For detailed historical data and advanced insights, 
          upgrade to <span className="font-semibold gradient-text">TaskSync Pro</span>.
        </p>
      </div>
    </motion.div>
  );
}