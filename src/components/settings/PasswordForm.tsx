"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AlertCircle, CheckCircle2, Lock } from "lucide-react";

export default function PasswordForm({ errors }: { errors?: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(errors || null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to update password.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 max-w-lg text-left"
    >
      {error && (
        <div
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <Input
        label="Current Password"
        type="password"
        id="current_password"
        name="current_password"
        value={currentPassword}
        onChange={(e) => {
          setError(null);
          setSuccess(null);
          setCurrentPassword(e.target.value);
        }}
        placeholder="Enter your current password"
        required
        leftIcon={<Lock className="w-4 h-4" />}
      />

      <Input
        label="New Password"
        type="password"
        id="new_password"
        name="new_password"
        value={newPassword}
        onChange={(e) => {
          setError(null);
          setSuccess(null);
          setNewPassword(e.target.value);
        }}
        placeholder="At least 8 characters"
        required
        leftIcon={<Lock className="w-4 h-4" />}
      />

      <Input
        label="Confirm New Password"
        type="password"
        id="confirm_new_password"
        name="confirm_new_password"
        value={confirmNewPassword}
        onChange={(e) => {
          setError(null);
          setSuccess(null);
          setConfirmNewPassword(e.target.value);
        }}
        placeholder="Confirm your new password"
        required
        error={
          newPassword && confirmNewPassword && newPassword !== confirmNewPassword
            ? "Passwords do not match"
            : undefined
        }
        leftIcon={<Lock className="w-4 h-4" />}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={
            !currentPassword ||
            !newPassword ||
            !confirmNewPassword ||
            newPassword !== confirmNewPassword ||
            isSubmitting
          }
        >
          {isSubmitting ? "Updating..." : "Save Password"}
        </Button>
      </div>
    </form>
  );
}
