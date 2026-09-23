"use client";

import { useAuth } from "@/lib/auth-context";
import { Navigation } from "@/components/layout/Navigation";

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-12 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation />
      <main className="lg:ml-64 min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  );
}