"use client";

import { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { SwitchThemeToggle } from "@/components/ThemeToggle";
import SessionProvider from "@/components/SessionProvider";
import NotificationBell from "@/components/NotificationBell";
import { Menu, LogOut, ShieldCheck, Home } from "lucide-react";

export default function AdminLayout({
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
        {/* Mobile Backdrop */}
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
          <AdminSidebar onClose={() => setIsMobileMenuOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Admin Header */}
          <header className="w-full border-b border-border-subtle px-4 sm:px-6 lg:px-8 py-3.5 bg-surface shrink-0">
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMobileMenu}
                  aria-label="Toggle navigation menu"
                  className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-text">
                    Admin Command Center
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    Privileged
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <NotificationBell />

                <div className="group relative">
                  <button
                    type="button"
                    aria-label="Admin quick settings"
                    className="flex items-center justify-center p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                  </button>

                  <div className="hidden group-hover:block absolute right-0 top-full pt-2 z-50 min-w-48 animate-fade-in">
                    <div className="bg-surface rounded-2xl shadow-xl border border-border-subtle p-2 space-y-1">
                      <div className="px-3 py-2 flex items-center justify-between text-xs text-text-muted">
                        <span>Theme</span>
                        <SwitchThemeToggle />
                      </div>
                      <div className="h-px bg-border-subtle my-1" />
                      <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text rounded-xl hover:bg-surface-elevated transition-colors"
                      >
                        <Home className="w-4 h-4 text-primary" />
                        Main Site
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

          {/* Scrollable Page Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </div>
      </main>
    </SessionProvider>
  );
}
