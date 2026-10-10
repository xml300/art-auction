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
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="px-4 sm:px-6 lg:px-8 py-3.5 border-b border-border-subtle bg-surface/90 backdrop-blur-md sticky top-0 z-30 w-full transition-colors">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="Artsyl Logo"
              width={36}
              height={36}
              className="rounded-full shadow-xs group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-lg tracking-tight text-text">Artsyl</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 items-center text-sm font-medium text-text">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="#about" className="hover:text-primary transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
          </li>
          <li>
            <Link href="#testimonials" className="hover:text-primary transition-colors">
              Reviews
            </Link>
          </li>
          <li className="flex items-center pl-2">
            <ThemeToggle />
          </li>
          <li>
            <Link
              href="/auth"
              className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors shadow-xs"
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
            className="p-2 rounded-xl text-text hover:bg-surface-elevated transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-surface border-l border-border-subtle shadow-2xl z-50 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col justify-between p-6 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-border-subtle">
            <span className="font-bold text-base text-text">Artsyl</span>
            <button
              onClick={toggleMobileMenu}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ul className="space-y-2 mt-6 text-sm font-medium text-text">
            <li>
              <Link
                href="/"
                onClick={toggleMobileMenu}
                className="block p-2.5 rounded-xl hover:bg-surface-elevated hover:text-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                onClick={toggleMobileMenu}
                className="block p-2.5 rounded-xl hover:bg-surface-elevated hover:text-primary transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#features"
                onClick={toggleMobileMenu}
                className="block p-2.5 rounded-xl hover:bg-surface-elevated hover:text-primary transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#testimonials"
                onClick={toggleMobileMenu}
                className="block p-2.5 rounded-xl hover:bg-surface-elevated hover:text-primary transition-colors"
              >
                Reviews
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-6 border-t border-border-subtle space-y-2">
          <Link
            href="/auth"
            onClick={toggleMobileMenu}
            className="w-full block text-center text-sm font-semibold py-2.5 px-4 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors shadow-xs"
          >
            Sign In / Register
          </Link>
        </div>
      </div>
    </header>
  );
}
