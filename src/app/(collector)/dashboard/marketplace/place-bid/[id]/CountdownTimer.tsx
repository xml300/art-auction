"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endTime: string | Date;
  onExpire?: () => void;
}

export function CountdownTimer({ endTime, onExpire }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    setMounted(true);
    const target = new Date(endTime).getTime();

    const calculateTime = () => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (!mounted) {
    return (
      <div className="min-w-[140px] h-[36px] rounded-card bg-surface-elevated animate-pulse border border-border-subtle" />
    );
  }

  if (timeLeft.isEnded) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 px-3 py-1.5 rounded-card bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-wider min-h-[36px]"
      >
        <Clock className="w-3.5 h-3.5" />
        <span>Auction Concluded</span>
      </div>
    );
  }

  const isCritical = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 5;
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;

  return (
    <div
      aria-label={`Time remaining: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-card border text-xs font-semibold min-h-[36px] ${
        isCritical
          ? "bg-destructive/10 border-destructive/30 text-destructive motion-safe:animate-pulse"
          : isUrgent
          ? "bg-warning/10 border-warning/30 text-warning motion-safe:animate-pulse"
          : "bg-surface-elevated border-border-subtle text-text"
      }`}
    >
      <Clock className={`w-3.5 h-3.5 shrink-0 ${isCritical ? "text-destructive" : isUrgent ? "text-warning" : "text-accent"}`} />
      <div className="flex items-center font-mono font-bold tracking-normal tabular-nums text-xs sm:text-sm">
        {timeLeft.days > 0 && (
          <>
            <span className="w-5 text-right">{String(timeLeft.days).padStart(2, "0")}</span>
            <span className="text-[10px] text-text-muted font-sans px-0.5">d</span>
          </>
        )}
        <span className="w-5 text-right">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="text-[10px] text-text-muted font-sans px-0.5">h</span>
        <span className="w-5 text-right">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="text-[10px] text-text-muted font-sans px-0.5">m</span>
        <span className="w-5 text-right">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="text-[10px] text-text-muted font-sans pl-0.5">s</span>
      </div>
    </div>
  );
}
