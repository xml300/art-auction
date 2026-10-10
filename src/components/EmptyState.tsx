import Image from "next/image";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  iconSrc?: string;
  title: string;
  message: string;
}

export default function EmptyState({ iconSrc, title, message }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface rounded-2xl border border-border-subtle shadow-xs space-y-3">
      {iconSrc ? (
        <Image
          src={iconSrc}
          width={64}
          height={64}
          alt={title}
          className="h-14 w-14 mb-2 text-text-muted opacity-60"
        />
      ) : (
        <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-bold text-text">{title}</h3>
      <p className="text-xs text-text-muted max-w-sm leading-relaxed">{message}</p>
    </div>
  );
}
