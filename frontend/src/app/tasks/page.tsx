"use client";

import { TasksTable } from "@/components/tasks/TasksTable";

export const dynamic = 'force-dynamic';

export default function TasksPage() {
  return (
    <div className="p-6 space-y-6">
      <TasksTable />
    </div>
  );
}