"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Gavel,
  Users,
  Landmark,
  ShieldAlert,
  ServerCog,
  LogOut,
  ExternalLink,
  X,
  ShieldCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/admin",
      label: "Overview",
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      exact: true,
    },
    {
      href: "/admin/auctions",
      label: "Auctions & Moderation",
      icon: <Gavel className="w-4 h-4 shrink-0" />,
    },
    {
      href: "/admin/users",
      label: "Users & Roles",
      icon: <Users className="w-4 h-4 shrink-0" />,
    },
    {
      href: "/admin/finance",
      label: "Financial Ledger",
      icon: <Landmark className="w-4 h-4 shrink-0" />,
    },
    {
      href: "/admin/audit-logs",
      label: "Security Audit Logs",
      icon: <ShieldAlert className="w-4 h-4 shrink-0" />,
    },
    {
      href: "/admin/system",
      label: "System Operations",
      icon: <ServerCog className="w-4 h-4 shrink-0" />,
    },
  ];

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="h-full max-h-full w-64 border-r border-border-subtle p-3.5 sm:p-4 flex flex-col justify-between bg-surface text-text">
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-5 px-2 shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-primary">Artsyl</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-3 h-3" />
              Admin
            </span>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="lg:hidden p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 text-xs sm:text-sm px-3 py-2 rounded-xl font-medium transition-all duration-150 ${
                  active
                    ? "bg-primary text-white shadow-xs font-semibold"
                    : "text-text-muted hover:text-text hover:bg-surface-elevated"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="pt-3 border-t border-border-subtle space-y-1 shrink-0 mt-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs sm:text-sm px-3 py-2 rounded-xl font-medium text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4 shrink-0" />
            Live Marketplace
          </span>
        </Link>
        <form action="/api/logout" method="POST" className="w-full">
          <button
            type="submit"
            onClick={onClose}
            className="w-full flex items-center gap-2.5 text-xs sm:text-sm px-3 py-2 rounded-xl font-medium text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
