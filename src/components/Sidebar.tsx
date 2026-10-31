"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  ShoppingCart,
  User,
  Settings,
  UserCircle,
  LogOut,
  DollarSign,
  X,
  Palette,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";

interface SidebarProps {
  onClose?: () => void;
  role?: "collector" | "artist";
}

interface NavSection {
  title: string;
  items: {
    href: string;
    content: string;
    icon: React.ReactNode;
  }[];
}

export default function Sidebar({ onClose, role = "collector" }: SidebarProps) {
  const pathname = usePathname();
  const { session } = useSession();

  const collectorSections: NavSection[] = [
    {
      title: "Discover",
      items: [
        { href: "/dashboard", content: "Overview", icon: <Home className="w-4 h-4 shrink-0" /> },
        { href: "/dashboard/marketplace", content: "Marketplace", icon: <ShoppingCart className="w-4 h-4 shrink-0" /> },
      ],
    },
    {
      title: "Collection & Assets",
      items: [
        { href: "/dashboard/my-artworks", content: "My Artworks", icon: <User className="w-4 h-4 shrink-0" /> },
        { href: "/dashboard/deposit", content: "Wallet & Deposit", icon: <DollarSign className="w-4 h-4 shrink-0" /> },
      ],
    },
    {
      title: "Preferences",
      items: [
        { href: "/dashboard/settings", content: "Settings", icon: <Settings className="w-4 h-4 shrink-0" /> },
      ],
    },
  ];

  const artistSections: NavSection[] = [
    {
      title: "Studio",
      items: [
        { href: "/artist-dashboard", content: "Overview", icon: <Home className="w-4 h-4 shrink-0" /> },
        { href: "/artist-dashboard/artworks", content: "My Artworks", icon: <Palette className="w-4 h-4 shrink-0" /> },
      ],
    },
    {
      title: "Auctions & Sales",
      items: [
        { href: "/artist-dashboard/artworks/new", content: "List Artwork", icon: <PlusCircle className="w-4 h-4 shrink-0" /> },
        { href: "/artist-dashboard/earnings", content: "Sales & Earnings", icon: <DollarSign className="w-4 h-4 shrink-0" /> },
      ],
    },
    {
      title: "Preferences",
      items: [
        { href: "/artist-dashboard/settings", content: "Settings", icon: <Settings className="w-4 h-4 shrink-0" /> },
      ],
    },
  ];

  const isArtist = role === "artist";
  const sections = isArtist ? artistSections : collectorSections;
  const brandHref = isArtist ? "/artist-dashboard" : "/";
  const profileHref = isArtist ? "/artist-dashboard/profile" : "/dashboard/profile";
  const roleLabel = isArtist ? "Artist" : "Collector";

  return (
    <div className="h-full max-h-full w-72 border-r border-border-subtle p-4 sm:p-5 flex flex-col justify-between bg-surface text-text shadow-xs">
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 px-1.5 shrink-0">
          <Link href={brandHref} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-text block leading-tight">
                Artsyl
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                {roleLabel} Studio
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted/70 px-3 py-1 select-none">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 text-sm min-h-[44px] px-3.5 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-accent/10 text-accent font-semibold border-l-2 border-accent shadow-xs"
                          : "text-text-muted hover:text-text hover:bg-surface-elevated"
                      }`}
                    >
                      <span className={isActive ? "text-accent" : "text-text-muted"}>
                        {link.icon}
                      </span>
                      <span>{link.content}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Account Footer with User Identity */}
      <div className="pt-4 border-t border-border-subtle shrink-0 mt-3 space-y-2">
        {session && (
          <div className="px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle flex items-center gap-3">
            {session.profilePicture ? (
              <Image
                src={session.profilePicture}
                alt={session.username}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border border-border-subtle"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/25 text-accent font-bold text-xs flex items-center justify-center">
                {session.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-text truncate">
                {session.username}
              </p>
              <p className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                Verified {roleLabel}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Link
            href={profileHref}
            onClick={onClose}
            className={`flex items-center gap-3 text-xs sm:text-sm min-h-[40px] px-3.5 py-2 rounded-xl font-medium transition-all duration-150 ${
              pathname === profileHref
                ? "bg-accent/10 text-accent font-semibold border-l-2 border-accent shadow-xs"
                : "text-text-muted hover:text-text hover:bg-surface-elevated"
            }`}
          >
            <UserCircle className="w-4 h-4 shrink-0" />
            Profile & History
          </Link>

          <form action="/api/logout" method="POST" className="w-full">
            <button
              type="submit"
              onClick={onClose}
              className="w-full flex items-center gap-3 text-xs sm:text-sm min-h-[40px] px-3.5 py-2 rounded-xl font-medium text-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
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
