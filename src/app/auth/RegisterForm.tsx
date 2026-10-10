"use client";

import { useError } from "@/hooks/useErrors";
import { Eye, EyeOff, User, Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, setError } = useError();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordMatch = password === confirmPassword || confirmPassword === "";
  const isPasswordValid = password.length >= 8;
  const isFormValid =
    username.trim().length >= 3 &&
    isEmailValid &&
    isPasswordValid &&
    password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          accountType: 2, // Collector default
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to create account.");
        setIsSubmitting(false);
        return;
      }

      const redirectPath = data.redirectUrl || "/dashboard";
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
        <h3 className="text-xl font-bold tracking-tight text-text">Create Account</h3>
        <p className="text-xs text-text-muted mt-1">Join the Artsyl collector community</p>
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

      {/* Role Pill - Collectors only */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated border border-border-subtle text-xs">
        <div className="flex items-center gap-2 text-text">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="font-semibold">Account Type</span>
        </div>
        <span className="font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px]">
          Collector
        </span>
      </div>

      <div className="space-y-4">
        <Input
          label="Username"
          type="text"
          name="username"
          id="reg-username"
          placeholder="Choose a unique username"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => {
            setError(null);
            setUsername(e.target.value);
          }}
          leftIcon={<User className="w-4 h-4" />}
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          id="reg-email"
          placeholder="Enter your email address"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setError(null);
            setEmail(e.target.value);
          }}
          error={email && !isEmailValid ? "Please enter a valid email address" : undefined}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          id="reg-password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => {
            setError(null);
            setPassword(e.target.value);
          }}
          hint={password && !isPasswordValid ? "Must be at least 8 characters" : undefined}
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

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          id="reg-confirmPassword"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => {
            setError(null);
            setConfirmPassword(e.target.value);
          }}
          error={!isPasswordMatch ? "Passwords do not match" : undefined}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="text-text-muted hover:text-text transition-colors p-1"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!isFormValid || isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Collector Account"}
        </Button>
      </div>
    </form>
  );
}
