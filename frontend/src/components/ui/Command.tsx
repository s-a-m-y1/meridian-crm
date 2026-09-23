"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X, ChevronRight, Loader2 } from "lucide-react";

interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, children, open, onOpenChange, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("fixed inset-0 z-50 flex items-center justify-center", open ? "block" : "hidden")}
      {...props}
    >
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {children}
      </div>
    </div>
  )
);
Command.displayName = "Command";

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-none border-none bg-transparent py-3 pl-10 pr-4 text-base outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  )
);
CommandInput.displayName = "CommandInput";

interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("max-h-[300px] overflow-y-auto", className)}
      {...props}
    />
  )
);
CommandList.displayName = "CommandList";

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-2", className)}
      {...props}
    />
  )
);
CommandGroup.displayName = "CommandGroup";

interface CommandItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onSelect?: () => void;
}

const CommandItem = React.forwardRef<HTMLButtonElement, CommandItemProps>(
  ({ className, onSelect, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm outline-none transition-colors",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "data-[selected=true]:bg-gray-100 data-[selected=true]:dark:bg-gray-800",
        className
      )}
      onClick={(e) => {
        onSelect?.();
        props.onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  )
);
CommandItem.displayName = "CommandItem";

interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("py-6 text-center text-sm text-gray-500 dark:text-gray-400", className)}
      {...props}
    />
  )
);
CommandEmpty.displayName = "CommandEmpty";

interface CommandSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

const CommandSeparator = React.forwardRef<HTMLHRElement, CommandSeparatorProps>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn("border-gray-200 dark:border-gray-700", className)}
      {...props}
    />
  )
);
CommandSeparator.displayName = "CommandSeparator";

export {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
};