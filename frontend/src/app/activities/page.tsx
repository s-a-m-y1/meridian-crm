"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Mail, Phone, MapPin, Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface ActivityData {
  id: string;
  type: string;
  content: string;
  leadId?: string | null;
  createdAt: string;
}

const activityIcons = {
  CALL: Phone,
  EMAIL: Mail,
  VIEWING: MapPin,
  NOTE: Calendar,
  WHATSAPP: Mail,
  MEETING: Calendar,
};

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

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { limit: 50 };
      if (filter) params.type = filter;
      const response = await api.getActivities(params);
      setActivities(response.data?.data ?? response.data ?? []);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
      toast.success("Activity deleted");
    } catch (error) {
      console.error("Failed to delete activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activities</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track all interactions with your leads and customers.
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", "CALL", "EMAIL", "VIEWING", "NOTE", "WHATSAPP", "MEETING"].map((type) => (
          <Button
            key={type || "all"}
            variant={filter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type)}
          >
            {type || "All"}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No activities found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => {
                const Icon =
                  activityIcons[activity.type as keyof typeof activityIcons] || Calendar;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{activity.type}</Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {activity.content}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(activity.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
