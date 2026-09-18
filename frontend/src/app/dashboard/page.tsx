"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Suspense } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container py-8">
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}