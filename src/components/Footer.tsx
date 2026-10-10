import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface text-text transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Logo"
                width={36}
                height={36}
                className="rounded-full"
              />
              <span className="font-bold text-base text-text">Artsyl</span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              The premier platform for curated luxury digital art auctions and verified ownership provenance.
            </p>
            <div className="space-y-2 text-xs text-text-muted">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" /> +234 123 456 789
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" /> concierge@artsyl.com
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-text mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-primary transition-colors">
                  About the Gallery
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-primary transition-colors">
                  Collector Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-text mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-xs text-text-muted">
              <li>
                <Link href="/dashboard/marketplace" className="hover:text-primary transition-colors">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link href="/dashboard/my-artworks" className="hover:text-primary transition-colors">
                  Vault Showcase
                </Link>
              </li>
              <li>
                <Link href="/dashboard/deposit" className="hover:text-primary transition-colors">
                  Wallet & Bidding
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-text mb-3">
              Security & Trust
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              All bids are legally binding and settled with verified custodial escrow. Digital certificate of authenticity issued for every acquired piece.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} Artsyl Luxury Auctions. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-text transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-text transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
