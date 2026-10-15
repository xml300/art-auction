"use client";

import Sidebar from "@/components/Sidebar";
import { SwitchThemeToggle } from "@/components/ThemeToggle";
import SessionProvider from "@/components/SessionProvider";
import NotificationBell from "@/components/NotificationBell";
import { LogOut, UserCircle, Menu, PlusCircle, Palette } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "@/hooks/useSession";

function ArtistProfilePicture() {
  const { session } = useSession();
  const profilePicture = session?.profilePicture || "/default-avatar.png";

  return (
    <Image
      src={profilePicture}
      className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover bg-surface-elevated hover:scale-105 transition-transform duration-200"
      width={40}
      height={40}
      alt="Artist Profile"
    />
  );
}

export default function ArtistDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <SessionProvider>
      <main className="flex h-screen h-dvh overflow-hidden bg-background text-text">
        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sidebar Container */}
        <aside
          className={`fixed top-0 left-0 h-dvh max-h-screen z-50 transform ${
            isMobileMenuOpen
              ? "translate-x-0 visible pointer-events-auto"
              : "-translate-x-full invisible pointer-events-none"
          } lg:translate-x-0 lg:visible lg:pointer-events-auto transition-transform duration-200 ease-in-out lg:static lg:h-full shrink-0`}
        >
          <Sidebar role="artist" onClose={() => setIsMobileMenuOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Navigation Bar */}
          <header className="w-full border-b border-border-subtle px-4 sm:px-6 lg:px-8 py-3.5 bg-surface shrink-0">
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMobileMenu}
                  aria-label="Toggle navigation menu"
                  className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary shrink-0" />
                  <h1 className="text-lg font-bold tracking-tight text-text">
                    Artist Studio
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/artist-dashboard/artworks/new"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-xs transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  List Artwork
                </Link>

                <NotificationBell />

                <div className="group relative">
                  <button
                    type="button"
                    aria-label="Artist account menu"
                    className="flex items-center justify-center rounded-full ring-2 ring-transparent group-hover:ring-primary/30 transition-all"
                  >
                    <ArtistProfilePicture />
                  </button>

                  <div className="hidden group-hover:block absolute right-0 top-full pt-2 z-50 min-w-48 animate-fade-in">
                    <div className="bg-surface rounded-2xl shadow-xl border border-border-subtle p-2 space-y-1">
                      <div className="px-3 py-2 flex items-center justify-between text-xs text-text-muted">
                        <span>Dark Theme</span>
                        <SwitchThemeToggle />
                      </div>
                      <div className="h-px bg-border-subtle my-1" />
                      <Link
                        href="/artist-dashboard/profile"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text rounded-xl hover:bg-surface-elevated transition-colors"
                      >
                        <UserCircle className="w-4 h-4 text-primary" />
                        Artist Profile
                      </Link>
                      <form action="/api/logout" method="POST">
                        <button
                          type="submit"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Viewport */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </div>
        </div>
      </main>
    </SessionProvider>
  );
}
