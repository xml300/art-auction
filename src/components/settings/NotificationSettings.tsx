"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";

export default function NotificationSettings() {
  const [isSaved, setIsSaved] = useState(false);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Notification preferences have been saved successfully.", "Preferences Updated");
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-lg text-left">
      <div>
        <h2 className="text-sm font-bold tracking-tight text-text mb-3">
          Email Alerts
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-xs font-medium text-text cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              name="weekly_newsletters"
              className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border-subtle"
            />
            <span>Curator weekly drops & exhibition invites</span>
          </label>
          <label className="flex items-center gap-3 text-xs font-medium text-text cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              name="new_artworks_notifications"
              className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border-subtle"
            />
            <span>Real-time outbid notifications</span>
          </label>
        </div>
      </div>

      <div className="pt-2 border-t border-border-subtle">
        <h2 className="text-sm font-bold tracking-tight text-text mb-3">
          Push & Web Alerts
        </h2>
        <label className="flex items-center gap-3 text-xs font-medium text-text cursor-pointer select-none">
          <input
            type="checkbox"
            name="enable_web_notifications"
            className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border-subtle"
          />
          <span>Enable browser auction hammer reminders (15 mins prior)</span>
        </label>
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary">
          {isSaved ? "Preferences Saved" : "Save Preferences"}
        </Button>
      </div>
    </form>
  );
}
