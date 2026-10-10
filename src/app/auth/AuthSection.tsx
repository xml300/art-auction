"use client";

import { useError } from "@/hooks/useErrors";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function AuthSection({ error }: { error: string }) {
  const [accType, setAcctype] = useState<"login" | "register">("login");
  const { setError } = useError();

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error, setError]);

  return (
    <div className="w-full">
      {/* Segmented Pill Tabs */}
      <div className="relative p-1 bg-surface-elevated rounded-xl flex max-w-xs mx-auto mb-6 border border-border-subtle">
        <button
          type="button"
          onClick={() => setAcctype("login")}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 z-10 text-center select-none",
            accType === "login"
              ? "bg-surface text-text shadow-xs"
              : "text-text-muted hover:text-text"
          )}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setAcctype("register")}
          className={cn(
            "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 z-10 text-center select-none",
            accType === "register"
              ? "bg-surface text-text shadow-xs"
              : "text-text-muted hover:text-text"
          )}
        >
          Register
        </button>
      </div>

      {/* Forms Container */}
      <div className="transition-all duration-200">
        {accType === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}