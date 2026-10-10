"use client";

import Link from "next/link";
import { Home, ShoppingCart, User, Settings, UserCircle, LogOut, DollarSign, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarLinks = [
    { href: "/dashboard", content: "Overview", icon: <Home className="w-4 h-4" /> },
    { href: "/dashboard/marketplace", content: "Marketplace", icon: <ShoppingCart className="w-4 h-4" /> },
    { href: "/dashboard/my-artworks", content: "My Artworks", icon: <User className="w-4 h-4" /> },
    { href: "/dashboard/deposit", content: "Wallet & Deposit", icon: <DollarSign className="w-4 h-4" /> },
    { href: "/dashboard/settings", content: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="h-full w-64 border-r border-border-subtle p-5 flex flex-col justify-between bg-surface text-text">
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-primary">Artsyl</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Collector
            </span>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 text-sm px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-white shadow-xs font-semibold"
                    : "text-text-muted hover:text-text hover:bg-surface-elevated"
                }`}
              >
                {link.icon}
                {link.content}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-border-subtle space-y-1">
        <Link
          href="/dashboard/profile"
          onClick={onClose}
          className={`flex items-center gap-3 text-sm px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 ${
            pathname === "/dashboard/profile"
              ? "bg-primary text-white shadow-xs font-semibold"
              : "text-text-muted hover:text-text hover:bg-surface-elevated"
          }`}
        >
          <UserCircle className="w-4 h-4" />
          Profile
        </Link>
        <form action="/api/logout" method="POST" className="w-full">
          <button
            type="submit"
            onClick={onClose}
            className="w-full flex items-center gap-3 text-sm px-3.5 py-2.5 rounded-xl font-medium text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
