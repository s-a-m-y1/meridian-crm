"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Button } from "@/components/ui/Button";
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function VerifyEmailPage() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid or missing verification token.");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
        });

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been verified. You can now sign in.");
        } else {
          const data = await response.json();
          setStatus("error");
          setMessage(data.message || "Failed to verify email. The link may have expired.");
        }
      } catch {
        setStatus("error");
        setMessage("An error occurred. Please try again later.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {status === "verifying" ? "Verifying..." : status === "success" ? "Email Verified!" : "Verification Failed"}
          </h1>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-6">
            {status === "verifying" && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying your email address...</p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Your email has been successfully verified. You can now sign in to your account.</p>
                <Link href="/login">
                  <Button className="w-full">Sign In</Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link href="/forgot-password">
                    <Button className="w-full">Resend Verification Email</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="w-full">Create New Account</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
