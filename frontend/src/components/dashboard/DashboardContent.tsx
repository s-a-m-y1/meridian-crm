"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";
import { AICopilot } from "@/components/ai/AICopilot";
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface StatData {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: typeof Target;
  color: string;
}

interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  budgetMin?: string;
  budgetMax?: string;
  requestedLocation?: string;
  requestedPropertyType?: string;
  customer?: { name: string } | null;
  createdAt: string;
}

interface TaskData {
  id: string;
  title: string;
  dueAt: string;
  status: string;
  lead?: { name: string } | null;
}

interface ActivityData {
  id: string;
  type: string;
  content: string;
  lead?: { name: string } | null;
  user?: { name: string } | null;
  createdAt: string;
}

const statusColors = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CONTACTED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  QUALIFIED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  UNQUALIFIED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
  CONVERTED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  HOT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  WARM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  COLD: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

const taskStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
};

const activityIcons = {
  CALL: Phone,
  EMAIL: Mail,
  VIEWING: MapPin,
  NOTE: Calendar,
  WHATSAPP: Mail,
};

function formatBudget(lead: LeadData) {
  if (lead.budgetMin && lead.budgetMax) {
    return `$${Number(lead.budgetMin).toLocaleString()} - $${Number(lead.budgetMax).toLocaleString()}`;
  }
  if (lead.budgetMin) return `From $${Number(lead.budgetMin).toLocaleString()}`;
  if (lead.budgetMax) return `Up to $${Number(lead.budgetMax).toLocaleString()}`;
  return "Not specified";
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [stats, setStats] = useState<StatData[]>([]);
  const [recentLeads, setRecentLeads] = useState<LeadData[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<TaskData[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityData[]>([]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [statsRes, leadsRes, tasksRes, activitiesRes] = await Promise.all([
        api.getDashboardStats(),
        api.getRecentLeads(5),
        api.getUpcomingTasks(5),
        api.getRecentActivities(5),
      ]);

      const statsData = statsRes.data;
      setStats([
        { 
          title: "Total Leads", 
          value: statsData.totalLeads ?? 0, 
          change: "+12%", 
          trend: "up", 
          icon: Target, 
          color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" 
        },
        { 
          title: "Active Deals", 
          value: statsData.activeDeals ?? 0, 
          change: "+8%", 
          trend: "up", 
          icon: DollarSign, 
          color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" 
        },
        { 
          title: "Tasks Due", 
          value: statsData.tasksDue ?? 0, 
          change: "-2%", 
          trend: "down", 
          icon: Clock, 
          color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" 
        },
        { 
          title: "Overdue Tasks", 
          value: statsData.overdueTasks ?? 0, 
          change: "+5%", 
          trend: "up", 
          icon: AlertTriangle, 
          color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400" 
        },
      ]);

      setRecentLeads(leadsRes.data ?? []);
      setUpcomingTasks(tasksRes.data ?? []);
      setRecentActivities(activitiesRes.data ?? []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setHasError(true);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">Recent Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Failed to load dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Something went wrong while fetching your data. Please try again.
          </p>
          <Button variant="outline" className="mt-4" onClick={fetchDashboardData}>
            <Loader2 className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast("Report export coming soon", { icon: "📄" })}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Export Report
          </button>
          <Link
            href="/leads"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + New Lead
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "text-sm font-medium",
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    )}>
                      {stat.trend === "up" ? "↑" : "↓"} {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className={cn("p-3 rounded-xl", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Leads */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Recent Leads</CardTitle>
              <Link href="/leads" className="text-sm text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              {recentLeads.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Target className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No leads found</p>
                  <Link href="/leads" className="text-sm text-primary hover:underline mt-2 inline-block">
                    Create your first lead →
                  </Link>
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Lead</th>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Contact</th>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Source</th>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Budget</th>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Location</th>
                      <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {recentLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-900 dark:text-white">{lead.phone}</p>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={lead.status as "NEW" | "CONTACTED" | "QUALIFIED" | "HOT" | "WARM" | "COLD"} 
                              className="text-xs"
                            >
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{lead.source}</td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{formatBudget(lead)}</td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{lead.requestedLocation || "—"}</td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{formatRelativeTime(lead.createdAt)}</td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </CardContent>

          </Card>

          {/* Upcoming Tasks */}
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
              <Link href="/tasks" className="text-sm text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No upcoming tasks
                  </div>
                ) : (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{task.lead?.name || "No lead"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={task.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"} 
                          className={cn("text-xs", taskStatusColors[task.status as keyof typeof taskStatusColors])}
                        >
                          {task.status}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{formatRelativeTime(task.dueAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <Link href="/activities" className="text-sm text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No recent activities
                  </div>
                ) : (
                  recentActivities.map((activity) => {
                    const Icon = activityIcons[activity.type as keyof typeof activityIcons] || Calendar;
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">{activity.content}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-medium">{activity.lead?.name || "—"}</span> · {formatRelativeTime(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <AIInsightsPanel />
        </div>
      </div>

      {/* AI Copilot - Floating Button */}
      <AICopilot />
    </div>
  );
}