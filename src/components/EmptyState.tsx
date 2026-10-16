import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  iconSrc?: string;
  title: string;
  message: string;
}

export default function EmptyState({ icon, iconSrc, title, message }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface rounded-card border border-border-subtle shadow-gallery space-y-3">
      {icon ? (
        <div className="p-3.5 rounded-card bg-surface-elevated border border-border-subtle text-accent mb-2">
          {icon}
        </div>
      ) : iconSrc ? (
        <Image
          src={iconSrc}
          width={64}
          height={64}
          alt={title}
          className="h-14 w-14 mb-2 text-text-muted opacity-60"
        />
      ) : (
        <div className="p-3.5 rounded-card bg-surface-elevated border border-border-subtle text-accent mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
      )}
      <h3 className="font-serif italic text-lg font-normal text-text">{title}</h3>
      <p className="text-xs text-text-muted max-w-sm leading-relaxed font-light">{message}</p>
    </div>
  );
}
