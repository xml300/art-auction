"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AlertCircle, Lock } from "lucide-react";

export default function PasswordForm({ errors }: { errors: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(errors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      e.preventDefault();
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      e.preventDefault();
      return;
    }
    setIsSubmitting(true);
  };

  return (
    <form
      method="POST"
      action="/api/profile/password"
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

      <Input
        label="Current Password"
        type="password"
        id="current_password"
        name="current_password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
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
        onChange={(e) => setNewPassword(e.target.value)}
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
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        placeholder="Confirm your new password"
        required
        error={newPassword && confirmNewPassword && newPassword !== confirmNewPassword ? "Passwords do not match" : undefined}
        leftIcon={<Lock className="w-4 h-4" />}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={!currentPassword || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword || isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Save Password"}
        </Button>
      </div>
    </form>
  );
}
