"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import {
  isPushSupported,
  getCurrentPushSubscription,
  subscribeUserToPush,
  unsubscribeUserFromPush,
} from "@/lib/pushClient";
import { BellRing, Send } from "lucide-react";

export default function NotificationSettings() {
  const [isSaved, setIsSaved] = useState(false);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState(false);
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [supported, setSupported] = useState(true);
  const toast = useToast();

  useEffect(() => {
    setSupported(isPushSupported());
    getCurrentPushSubscription().then((sub) => {
      setIsPushEnabled(!!sub);
    });
  }, []);

  const handlePushToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsPushLoading(true);

    if (checked) {
      const res = await subscribeUserToPush();
      if (res.success) {
        setIsPushEnabled(true);
        toast.success("Web push notifications enabled successfully.", "Push Alerts Active");
      } else {
        setIsPushEnabled(false);
        toast.error(res.error || "Could not enable push notifications.", "Permission Error");
      }
    } else {
      await unsubscribeUserFromPush();
      setIsPushEnabled(false);
      toast.info("Web push notifications disabled.", "Push Alerts Inactive");
    }

    setIsPushLoading(false);
  };

  const handleTestPush = async () => {
    setIsTestingPush(true);
    try {
      const res = await fetch("/api/notifications/push/test", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, "Test Dispatched");
      } else {
        toast.error(data.error || "Failed to dispatch test notification");
      }
    } catch {
      toast.error("Failed to connect to notification server");
    } finally {
      setIsTestingPush(false);
    }
  };

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

      <div className="pt-2 border-t border-border-subtle space-y-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-text mb-1">
            Push & Web Alerts (VAPID)
          </h2>
          <p className="text-xs text-text-muted">
            Receive native desktop and mobile notifications when outbid or when lots close.
          </p>
        </div>

        {supported ? (
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-xs font-medium text-text cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPushEnabled}
                onChange={handlePushToggle}
                disabled={isPushLoading}
                className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border-subtle"
              />
              <span>
                {isPushLoading
                  ? "Configuring device subscription..."
                  : "Enable browser auction hammer reminders & outbid push alerts"}
              </span>
            </label>

            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestPush}
                disabled={isTestingPush}
                leftIcon={<BellRing className="w-3.5 h-3.5" />}
              >
                {isTestingPush ? "Dispatching..." : "Send Test Notification"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-amber-500">
            Web Push is not supported in this browser environment.
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary">
          {isSaved ? "Preferences Saved" : "Save Preferences"}
        </Button>
      </div>
    </form>
  );
}
