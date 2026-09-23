"use client";

import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import { GlobalSearch } from "@/components/global-search/GlobalSearch";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <GlobalSearch />
      <Toaster
        position="top-right"
        containerStyle={{ top: 76, right: 16, zIndex: 9999 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </AuthProvider>
  );
}