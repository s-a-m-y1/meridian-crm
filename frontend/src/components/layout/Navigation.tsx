"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Home, 
  DollarSign, 
  CheckSquare,
  Calendar, 
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Target },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Properties", href: "/properties", icon: Home },
  { name: "Deals", href: "/deals", icon: DollarSign },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Activities", href: "/activities", icon: Calendar },
];

export function Navigation() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg text-gray-700 dark:text-gray-300"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700",
          "transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Meridian CRM</span>
            </Link>
            {/* Close button (mobile only) */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={user?.name || "User"}>
                  {user?.name || "User"}
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400 truncate"
                  title={user?.email || "user@example.com"}
                >
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Link
                href="/settings"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  // Full reload to /login: logout clears the session, and the
                  // dashboard would otherwise stay on screen with dead state.
                  window.location.href = "/login";
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                )}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
