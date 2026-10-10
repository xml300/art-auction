"use client";

import Sidebar from "@/components/Sidebar";
import { SwitchThemeToggle } from "@/components/ThemeToggle";
import SessionProvider from "@/components/SessionProvider";
import ProfilePicture from "./ProfilePicture";
import { LogOut, UserCircle, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({
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
      <main className="flex h-screen overflow-hidden bg-background text-text">
        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sidebar Container */}
        <aside
          className={`fixed top-0 left-0 h-full z-50 transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-200 ease-in-out lg:static shrink-0`}
        >
          <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Navigation Bar */}
          <header className="w-full border-b border-border-subtle px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center bg-surface shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileMenu}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold tracking-tight text-text">
                Collector Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="group relative">
                <button
                  type="button"
                  aria-label="User account menu"
                  className="rounded-full ring-2 ring-transparent group-hover:ring-primary/30 transition-all"
                >
                  <ProfilePicture />
                </button>

                <div className="hidden group-hover:block absolute right-0 top-full pt-2 z-50 min-w-48 animate-fade-in">
                  <div className="bg-surface rounded-2xl shadow-xl border border-border-subtle p-2 space-y-1">
                    <div className="px-3 py-2 flex items-center justify-between text-xs text-text-muted">
                      <span>Dark Theme</span>
                      <SwitchThemeToggle />
                    </div>
                    <div className="h-px bg-border-subtle my-1" />
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text rounded-xl hover:bg-surface-elevated transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-primary" />
                      View Profile
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
