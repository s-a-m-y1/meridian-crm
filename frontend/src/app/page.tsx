"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (pathname === "/" || pathname === "/login" || pathname === "/register") {
        if (user) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4 text-center">
        <div className="h-12 w-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}