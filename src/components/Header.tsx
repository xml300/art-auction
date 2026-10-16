"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="px-4 sm:px-6 lg:px-8 py-3.5 border-b border-border-subtle bg-surface/90 backdrop-blur-md sticky top-0 z-30 w-full transition-colors">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/logo.png"
                alt="Artsyl Logo"
                width={36}
                height={36}
                className="rounded-full shadow-gallery ring-1 ring-border-subtle group-hover:scale-105 transition-transform"
              />
              <span className="font-serif text-xl tracking-wider text-text font-semibold uppercase">
                Artsyl
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 items-center text-xs uppercase tracking-catalog font-medium text-text/75">
            <li>
              <Link href="/" className="hover:text-text transition-colors py-1 border-b border-transparent hover:border-accent">
                Home
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-text transition-colors py-1 border-b border-transparent hover:border-accent">
                The Gallery
              </Link>
            </li>
            <li>
              <Link href="#features" className="hover:text-text transition-colors py-1 border-b border-transparent hover:border-accent">
                Curatorial
              </Link>
            </li>
            <li>
              <Link href="#testimonials" className="hover:text-text transition-colors py-1 border-b border-transparent hover:border-accent">
                Patrons
              </Link>
            </li>
            <li className="flex items-center pl-2">
              <ThemeToggle />
            </li>
            <li>
              <Link
                href="/auth"
                className="inline-flex items-center text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-card bg-primary text-primary-foreground hover:bg-primary-hover border border-border-strong transition-all shadow-gallery"
              >
                Enter Gallery
              </Link>
            </li>
          </ul>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-card text-text hover:bg-surface-elevated transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
        className={`fixed top-0 right-0 w-72 h-full bg-surface border-l border-border-subtle shadow-2xl z-50 transform transition-all duration-200 ease-in-out md:hidden flex flex-col justify-between p-6 ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100 visible pointer-events-auto"
            : "translate-x-full opacity-0 invisible pointer-events-none"
        }`}
      >
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
            <span className="font-serif font-bold text-lg tracking-wider uppercase text-text">Artsyl</span>
            <button
              onClick={toggleMobileMenu}
              aria-label="Close navigation menu"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-card text-text-muted hover:text-text hover:bg-surface-elevated"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ul className="space-y-2 mt-6 text-xs uppercase tracking-catalog font-medium text-text">
            <li>
              <Link
                href="/"
                onClick={toggleMobileMenu}
                className="block p-3 rounded-card hover:bg-surface-elevated hover:text-accent transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                onClick={toggleMobileMenu}
                className="block p-3 rounded-card hover:bg-surface-elevated hover:text-accent transition-colors"
              >
                The Gallery
              </Link>
            </li>
            <li>
              <Link
                href="#features"
                onClick={toggleMobileMenu}
                className="block p-3 rounded-card hover:bg-surface-elevated hover:text-accent transition-colors"
              >
                Curatorial
              </Link>
            </li>
            <li>
              <Link
                href="#testimonials"
                onClick={toggleMobileMenu}
                className="block p-3 rounded-card hover:bg-surface-elevated hover:text-accent transition-colors"
              >
                Patrons
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-6 border-t border-border-subtle space-y-2">
          <Link
            href="/auth"
            onClick={toggleMobileMenu}
            className="w-full block text-center text-xs uppercase tracking-wider font-semibold py-3 px-4 rounded-card bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-gallery"
          >
            Sign In / Register
          </Link>
        </div>
      </div>
    </>
  );
}
