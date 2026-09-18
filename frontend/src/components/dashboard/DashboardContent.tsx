"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Leads", value: "1,234", change: "+12%", trend: "up", icon: Target, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
  { title: "Active Deals", value: "56", change: "+8%", trend: "up", icon: DollarSign, color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" },
  { title: "Revenue (MTD)", value: "$2.4M", change: "+23%", trend: "up", icon: TrendingUp, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" },
  { title: "Conversion Rate", value: "23.5%", change: "-2%", trend: "down", icon: AlertTriangle, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400" },
];

const recentLeads = [
  { id: "1", name: "Ahmed Hassan", email: "ahmed@example.com", phone: "+20 10 1234 5678", status: "NEW", source: "WEBSITE", budget: "$500k - $1M", location: "Cairo", date: "2 hours ago" },
  { id: "2", name: "Sarah Mohamed", email: "sarah@example.com", phone: "+20 11 9876 5432", status: "QUALIFIED", source: "REFERRAL", budget: "$200k - $500k", location: "Alexandria", date: "5 hours ago" },
  { id: "3", name: "Omar Ali", email: "omar@example.com", phone: "+20 12 5555 1234", status: "CONTACTED", source: "PHONE", budget: "$1M+", location: "Giza", date: "1 day ago" },
  { id: "4", name: "Fatima Ahmed", email: "fatima@example.com", phone: "+20 10 7777 8888", status: "HOT", source: "SOCIAL", budget: "$800k - $1.5M", location: "New Cairo", date: "2 days ago" },
  { id: "5", name: "Khaled Mahmoud", email: "khaled@example.com", phone: "+20 11 2222 3333", status: "COLD", source: "EMAIL", budget: "$300k - $600k", location: "Sheikh Zayed", date: "3 days ago" },
];

const upcomingTasks = [
  { id: "1", title: "Call Ahmed Hassan", dueAt: "Today 10:00 AM", status: "PENDING", lead: "Ahmed Hassan" },
  { id: "2", title: "Property viewing with Sarah", dueAt: "Today 2:00 PM", status: "PENDING", lead: "Sarah Mohamed" },
  { id: "3", title: "Send proposal to Omar", dueAt: "Tomorrow 10:00 AM", status: "PENDING", lead: "Omar Ali" },
  { id: "4", title: "Follow up with Fatima", dueAt: "Tomorrow 3:00 PM", status: "IN_PROGRESS", lead: "Fatima Ahmed" },
];

const recentActivities = [
  { id: "1", type: "CALL", content: "Discussed property requirements with Ahmed Hassan", lead: "Ahmed Hassan", time: "1 hour ago" },
  { id: "2", type: "EMAIL", content: "Sent property listings to Sarah Mohamed", lead: "Sarah Mohamed", time: "3 hours ago" },
  { id: "3", type: "VIEWING", content: "Completed property viewing with Omar Ali", lead: "Omar Ali", time: "5 hours ago" },
  { id: "4", type: "NOTE", content: "Added note about budget increase for Fatima", lead: "Fatima Ahmed", time: "1 day ago" },
  { id: "5", type: "WHATSAPP", content: "WhatsApp follow-up with Khaled Mahmoud", lead: "Khaled Mahmoud", time: "2 days ago" },
];

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

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            + New Lead
          </button>
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
              <button className="text-sm text-primary hover:underline">View all</button>
            </CardHeader>
            <CardContent>
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
                          <Badge variant={lead.status as "NEW" | "CONTACTED" | "QUALIFIED" | "HOT" | "WARM" | "COLD"} className="text-xs">
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{lead.source}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{lead.budget}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{lead.location}</td>
                        <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{lead.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
              <button className="text-sm text-primary hover:underline">View all</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{task.lead}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={task.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"} className="text-xs">
                        {task.status}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{task.dueAt}</span>
                    </div>
                  </div>
                ))}
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
              <button className="text-sm text-primary hover:underline">View all</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activityIcons[activity.type as keyof typeof activityIcons] || Calendar;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="font-medium">{activity.lead}</span> · {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Properties Listed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">47</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Response Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2.3h</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Client Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">98%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}