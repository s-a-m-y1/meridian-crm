"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = 
  | "default" 
  | "secondary" 
  | "destructive" 
  | "outline" 
  | "success" 
  | "warning" 
  | "info"
  | "NEW" 
  | "CONTACTED" 
  | "QUALIFIED" 
  | "UNQUALIFIED" 
  | "CONVERTED" 
  | "HOT" 
  | "WARM" 
  | "COLD"
  | "PENDING" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "CANCELLED";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants: Record<BadgeVariant, string> = {
      default: "bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
      destructive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      outline: "border border-gray-300 dark:border-gray-600",
      success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      CONTACTED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      QUALIFIED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      UNQUALIFIED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
      CONVERTED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      HOT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      WARM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      COLD: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";