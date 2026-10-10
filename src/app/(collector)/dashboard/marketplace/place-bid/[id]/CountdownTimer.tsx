"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endTime: string | Date;
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    const target = new Date(endTime).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEnded: true,
        });
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
  }, [endTime]);

  if (timeLeft.isEnded) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5" />
        <span>Auction Concluded</span>
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
        isUrgent
          ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse"
          : "bg-surface-elevated border-border-subtle text-text"
      }`}
    >
      <Clock className={`w-3.5 h-3.5 shrink-0 ${isUrgent ? "text-amber-500" : "text-primary"}`} />
      <div className="flex items-center gap-1 font-mono tracking-tight text-xs sm:text-sm">
        {timeLeft.days > 0 && (
          <>
            <span className="font-bold">{timeLeft.days}</span>
            <span className="text-[10px] text-text-muted font-sans mr-0.5">d</span>
          </>
        )}
        <span className="font-bold">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="text-[10px] text-text-muted font-sans mr-0.5">h</span>
        <span className="font-bold">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="text-[10px] text-text-muted font-sans mr-0.5">m</span>
        <span className="font-bold">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="text-[10px] text-text-muted font-sans">s</span>
      </div>
    </div>
  );
}
