"use client";

import Link from "next/link";
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useError } from "@/hooks/useErrors";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Roles } from "@/enums";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, setError } = useError();

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setError(data.error || "Invalid username or password.");
        setIsSubmitting(false);
        return;
      }

      const redirectPath = data.redirectUrl || (data.user?.roleId === Roles.Artist ? "/artist-dashboard" : "/dashboard");
      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 text-left" onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold tracking-tight text-text">Welcome Back</h3>
        <p className="text-xs text-text-muted mt-1">Sign in to your Artsyl collector account</p>
      </div>

      {error && (
        <div
          className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-fade-in"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Username"
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => {
            setError(null);
            setUsername(e.target.value);
          }}
          leftIcon={<User className="w-4 h-4" />}
        />

        <div className="space-y-1.5">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setError(null);
              setPassword(e.target.value);
            }}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-text-muted hover:text-text transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <div className="flex justify-end pt-1">
            <Link
              href="/auth"
              className="text-xs text-primary hover:text-primary-hover transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!isFormValid || isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
