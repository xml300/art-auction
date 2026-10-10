"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Coins,
  Award,
  AlertCircle,
  Heart,
  Info,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Notification, NotificationType } from "@/types";
import { cn } from "@/lib/utils";

interface NotificationData {
  artworkId?: number;
  targetUrl?: string;
  amount?: number;
}

const typeIconMap: Record<
  NotificationType,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  outbid: {
    icon: AlertCircle,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  auction_won: {
    icon: Award,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  auction_ending_soon: {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  deposit_success: {
    icon: Coins,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  watchlist_reminder: {
    icon: Heart,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  system: {
    icon: Info,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
};

function formatTimeAgo(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initial fetch and SSE live stream connection
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const fetchInitial = async () => {
      try {
        const res = await fetch("/api/notifications?limit=15");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // quiet fallback
      }
    };

    fetchInitial();

    try {
      eventSource = new EventSource("/api/notifications/stream");
      eventSource.addEventListener("update", (e) => {
        try {
          const data = JSON.parse(e.data);
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        } catch {
          // parse error
        }
      });
    } catch {
      // EventSource unavailable
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // revert on network failure
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await fetch("/api/notifications?all=true", {
        method: "PATCH",
      });
    } catch {
      // failure
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications, ${unreadCount} unread`}
        className="relative p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-scale-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-surface border border-border-subtle shadow-2xl z-50 animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-surface-elevated/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-text">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-text-muted hover:text-primary transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-border-subtle/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text-muted space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-40 text-text-muted" />
                <p className="text-xs font-medium">No notifications yet</p>
                <p className="text-[11px] text-text-muted/70">
                  You will be notified about outbids and auction countdowns here.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const config = typeIconMap[item.type] || typeIconMap.system;
                const Icon = config.icon;
                let parsedData: NotificationData = {};
                try {
                  if (item.data) parsedData = JSON.parse(item.data);
                } catch {
                  // ignore
                }

                const targetUrl =
                  parsedData.targetUrl ||
                  (parsedData.artworkId
                    ? `/dashboard/marketplace/place-bid/${parsedData.artworkId}`
                    : null);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "p-3.5 flex items-start gap-3 transition-colors relative hover:bg-surface-elevated/60",
                      !item.isRead && "bg-primary/[0.03]"
                    )}
                  >
                    <div className={cn("p-2 rounded-xl shrink-0 mt-0.5", config.bg)}>
                      <Icon className={cn("w-4 h-4", config.color)} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={cn(
                            "text-xs tracking-tight",
                            item.isRead
                              ? "font-medium text-text"
                              : "font-bold text-text"
                          )}
                        >
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-text-muted shrink-0">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        {targetUrl ? (
                          <Link
                            href={targetUrl}
                            onClick={() => {
                              if (!item.isRead) handleMarkAsRead(item.id);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover transition-colors"
                          >
                            <span>View lot</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : null}

                        {!item.isRead && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(item.id)}
                            className="text-[11px] font-medium text-text-muted hover:text-text transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>

                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 self-center" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
