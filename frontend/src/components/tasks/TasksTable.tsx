"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Filter, CheckSquare, Calendar, Clock, Loader2, ChevronLeft, ChevronRight, Edit, Trash2, Eye, MoreHorizontal, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueAt?: string;
  leadId?: string;
  ownerId?: string;
  organizationId: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  lead?: { name: string };
}

interface TasksResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

const TASK_STATUSES = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "IN_PROGRESS", label: "In Progress", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "COMPLETED", label: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400" },
];

export function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [leadFilter, setLeadFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const limit = 20;

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (leadFilter) params.leadId = leadFilter;
      
      const response = await api.getTasks(params);
      setTasks(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, search, statusFilter, leadFilter]);

  const getStatusConfig = (status: string) => {
    return TASK_STATUSES.find(s => s.value === status) || TASK_STATUSES[0];
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueAt || task.completed) return false;
    return new Date(task.dueAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your tasks and deadlines</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {TASK_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input 
              placeholder="Lead ID (optional)" 
              value={leadFilter} 
              onChange={e => { setLeadFilter(e.target.value); setPage(1); }} 
              className="w-[200px]" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Task</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Due Date</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Lead</th>
                  <th className="text-right p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {tasks.map(task => (
                  <tr key={task.id} className={cn("hover:bg-gray-50 dark:hover:bg-gray-800/50", isOverdue(task) && "bg-red-50/50 dark:bg-red-900/10")}>
                    <td className="p-4">
                      <div>
                        <p className={cn("font-medium", isOverdue(task) && "text-red-600 dark:text-red-400")}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className={cn(getStatusConfig(task.status).color)}>
                        {getStatusConfig(task.status).label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {task.dueAt ? (
                        <div className={cn("flex items-center gap-2", isOverdue(task) && "text-red-600 dark:text-red-400")}>
                          <Calendar className="w-4 h-4" />
                          <span className={cn(isOverdue(task) && "font-medium")}>
                            {new Date(task.dueAt).toLocaleDateString()}
                            {isOverdue(task) && <AlertTriangle className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No due date</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {task.lead?.name || "—"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedTask(task); setShowDetail(true); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { /* edit */ }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(task.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {tasks.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
              <Button variant="outline" className="mt-3" onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} tasks
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => p + 1)}
              disabled={page * limit >= total}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {showDetail && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b flex items-center justify-between">
              <CardTitle className="text-xl">{selectedTask.title}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => { setShowDetail(false); setSelectedTask(null); }}>
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {selectedTask.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                  <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-wrap">{selectedTask.description}</p>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <Badge variant="secondary" className={cn(getStatusConfig(selectedTask.status).color, "mt-1")}>
                    {getStatusConfig(selectedTask.status).label}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {selectedTask.dueAt ? new Date(selectedTask.dueAt).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead</label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedTask.lead?.name || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {selectedTask.completed && selectedTask.completedAt 
                      ? new Date(selectedTask.completedAt).toLocaleDateString() 
                      : "Not completed"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                  <p className="text-gray-900 dark:text-white mt-1">{new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setShowDetail(false); setSelectedTask(null); }}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => { /* edit */ }}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => { handleDelete(selectedTask.id); setShowDetail(false); setSelectedTask(null); }}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-xl">Create New Task</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CreateTaskForm onClose={() => setShowCreate(false)} onSuccess={fetchTasks} />
            </CardContent>
          </div>
        </div>
      )}

      {isLoading && tasks.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

function CreateTaskForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: "", description: "", status: "PENDING", dueAt: "", leadId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createTask({
        ...formData,
        dueAt: formData.dueAt ? new Date(formData.dueAt) : undefined,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Call client" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          placeholder="Task details..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            {TASK_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <Input type="date" value={formData.dueAt} onChange={e => setFormData({...formData, dueAt: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Lead ID</label>
        <Input value={formData.leadId} onChange={e => setFormData({...formData, leadId: e.target.value})} placeholder="Lead UUID" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Task"}
        </Button>
      </div>
    </form>
  );
}