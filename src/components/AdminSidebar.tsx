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
import { useSession } from "@/hooks/useSession";

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { session } = useSession();

  const navSections = [
    {
      title: "Governance",
      items: [
        {
          href: "/admin",
          label: "Executive Overview",
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
          label: "Users & Permissions",
          icon: <Users className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: "Finance & Security",
      items: [
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
      ],
    },
  ];

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="h-full max-h-full w-72 border-r border-border-subtle p-4 sm:p-5 flex flex-col justify-between bg-surface text-text shadow-xs">
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 px-1.5 shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-text block leading-tight">
                Artsyl
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Command Center
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted/70 px-3 py-1 select-none">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((link) => {
                  const active = isLinkActive(link.href, link.exact);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 text-sm min-h-[44px] px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                        active
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-l-2 border-amber-500 shadow-xs"
                          : "text-text-muted hover:text-text hover:bg-surface-elevated"
                      }`}
                    >
                      <span className={active ? "text-amber-600 dark:text-amber-400" : "text-text-muted"}>
                        {link.icon}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-border-subtle shrink-0 mt-3 space-y-2">
        {session && (
          <div className="px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center">
              {session.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-text truncate">
                {session.username}
              </p>
              <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Administrator
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs sm:text-sm min-h-[40px] px-3.5 py-2 rounded-xl font-medium text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
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
              className="w-full flex items-center gap-2.5 text-xs sm:text-sm min-h-[40px] px-3.5 py-2 rounded-xl font-medium text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
