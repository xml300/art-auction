"use client";

import Link from "next/link";
import { Home, ShoppingCart, User, Settings, UserCircle, LogOut, DollarSign, X, Palette, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onClose?: () => void;
  role?: "collector" | "artist";
}

export default function Sidebar({ onClose, role = "collector" }: SidebarProps) {
  const pathname = usePathname();

  const collectorLinks = [
    { href: "/dashboard", content: "Overview", icon: <Home className="w-4 h-4 shrink-0" /> },
    { href: "/dashboard/marketplace", content: "Marketplace", icon: <ShoppingCart className="w-4 h-4 shrink-0" /> },
    { href: "/dashboard/my-artworks", content: "My Artworks", icon: <User className="w-4 h-4 shrink-0" /> },
    { href: "/dashboard/deposit", content: "Wallet & Deposit", icon: <DollarSign className="w-4 h-4 shrink-0" /> },
    { href: "/dashboard/settings", content: "Settings", icon: <Settings className="w-4 h-4 shrink-0" /> },
  ];

  const artistLinks = [
    { href: "/artist-dashboard", content: "Overview", icon: <Home className="w-4 h-4 shrink-0" /> },
    { href: "/artist-dashboard/artworks", content: "My Artworks", icon: <Palette className="w-4 h-4 shrink-0" /> },
    { href: "/artist-dashboard/artworks/new", content: "List Artwork", icon: <PlusCircle className="w-4 h-4 shrink-0" /> },
    { href: "/artist-dashboard/earnings", content: "Sales & Earnings", icon: <DollarSign className="w-4 h-4 shrink-0" /> },
    { href: "/artist-dashboard/settings", content: "Settings", icon: <Settings className="w-4 h-4 shrink-0" /> },
  ];

  const isArtist = role === "artist";
  const sidebarLinks = isArtist ? artistLinks : collectorLinks;
  const brandHref = isArtist ? "/artist-dashboard" : "/";
  const profileHref = isArtist ? "/artist-dashboard/profile" : "/dashboard/profile";
  const roleLabel = isArtist ? "Artist" : "Collector";

  return (
    <div className="h-full max-h-full w-64 border-r border-border-subtle p-3.5 sm:p-4 flex flex-col justify-between bg-surface text-text">
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-4 px-2 shrink-0">
          <Link href={brandHref} className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-primary">Artsyl</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {roleLabel}
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
        <nav className="space-y-0.5 flex-1 min-h-0 overflow-y-auto pr-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 text-xs sm:text-sm px-3 py-2 rounded-xl font-medium transition-all duration-150 ${
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

      {/* Account Footer (Pinned, always visible without scrolling) */}
      <div className="pt-3 border-t border-border-subtle space-y-0.5 shrink-0 mt-2">
        <Link
          href={profileHref}
          onClick={onClose}
          className={`flex items-center gap-2.5 text-xs sm:text-sm px-3 py-2 rounded-xl font-medium transition-all duration-150 ${
            pathname === profileHref
              ? "bg-primary text-white shadow-xs font-semibold"
              : "text-text-muted hover:text-text hover:bg-surface-elevated"
          }`}
        >
          <UserCircle className="w-4 h-4 shrink-0" />
          Profile
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
