import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TestimonialCard } from "@/components/TestimonialCard";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ArtworkCarousel } from "@/components/ArtworksCarousel";
import { SendHorizonal, ShieldCheck, Eye, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getArtworks } from "@/data/queries";

export default async function Home() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      date: "2024-09-15T10:00:00Z",
      comment: "Artsyl is unmatched in curation and auction integrity. Acquired two rare digital pieces with zero friction.",
      position: "Lead UX Designer at TechCorp",
    },
    {
      id: 2,
      name: "Marcus Rivas",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      date: "2024-10-01T15:30:00Z",
      comment: "The real-time bidding interface is sleek and transparent. Provenance verification gave me total confidence.",
      position: "Senior Data Analyst, FinTrack",
    },
    {
      id: 3,
      name: "Aisha Khan",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cfce72b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      date: "2024-10-14T08:45:00Z",
      comment: "Top-tier curated marketplace for serious digital art collectors. Customer concierge is first-class.",
      position: "CEO of Creative Solutions",
    },
  ];

  const artworks = await getArtworks();

  return (
    <main className="min-h-screen flex flex-col bg-background text-text transition-colors overflow-x-hidden">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 space-y-16">
        {/* Curatorial Fine Art Hero */}
        <section
          id="hero"
          className="relative rounded-card overflow-hidden bg-stone-950 text-white min-h-[460px] sm:min-h-[520px] flex items-center justify-center p-8 sm:p-16 border border-stone-800 shadow-gallery-elevated"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity grayscale"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />

          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] uppercase tracking-catalog font-semibold bg-stone-900/80 text-accent border border-accent/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Curated Autumn Saleroom • Live Lots
            </span>

            <h1 className="font-serif text-3xl sm:text-6xl font-normal tracking-tight leading-[1.1]">
              Collect Exceptional <br />
              <span className="italic font-normal text-stone-200">
                Digital Masterpieces
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
              Curated digital auctions governed by immutable provenance, private escrow locks, and direct access to visionary creators.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auth"
                className="w-full sm:w-auto px-7 py-3 rounded-card bg-stone-100 hover:bg-white text-stone-950 text-xs uppercase tracking-wider font-semibold transition-all shadow-gallery active:scale-95"
              >
                Explore Curated Lots
              </Link>
              <Link
                href="#about"
                className="w-full sm:w-auto px-7 py-3 rounded-card bg-stone-900/60 hover:bg-stone-800/80 text-stone-200 text-xs uppercase tracking-wider font-semibold backdrop-blur-md transition-all border border-stone-700 active:scale-95"
              >
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Multi-Item Showcase Carousel (Responsive across all screens) */}
        <section id="showcase">
          <ArtworkCarousel artworks={artworks} />
        </section>

        {/* About Section */}
        <section
          id="about"
          className="rounded-card border border-border-subtle bg-surface p-8 sm:p-12 shadow-gallery"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-gallery overflow-hidden bg-surface-elevated border border-border-subtle p-6 flex items-center justify-center shadow-gallery">
                <Image
                  src="/logo.png"
                  alt="Artsyl Crest"
                  width={140}
                  height={140}
                  className="rounded-full shadow-md object-contain"
                />
              </div>
            </div>

            <div className="space-y-4 text-left">
              <span className="font-serif text-xs uppercase tracking-catalog font-semibold text-accent block">
                About the Saleroom
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-text">
                Setting the Standard for Digital Fine Art
              </h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light">
                Artsyl is a curated auction platform connecting esteemed collectors with visionary digital creators. Each artwork passes strict authenticity scrutiny before entering live bidding.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-card bg-accent/10 text-accent shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text">Verified Provenance</h4>
                    <p className="text-[11px] text-text-muted font-light">Unbroken chain of custody for every minted piece.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-card bg-accent/10 text-accent shrink-0 mt-0.5">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text">Expert Curation</h4>
                    <p className="text-[11px] text-text-muted font-light">Strictly limited releases selected by advisory curators.</p>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/auth"
                  className="inline-flex items-center text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-card bg-primary text-primary-foreground hover:bg-primary-hover border border-border-strong transition-all shadow-gallery"
                >
                  Join as a Collector
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Platform Features */}
        <section id="features" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-serif text-xs uppercase tracking-catalog font-semibold text-accent">
              Core Capabilities
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-text mt-1">
              Built for Modern Digital Collecting
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-card border border-border-subtle bg-surface p-7 shadow-gallery hover:border-accent/40 transition-all duration-300 space-y-3">
              <span className="font-mono text-xs font-semibold text-accent tracking-widest block">
                01
              </span>
              <h3 className="font-serif text-base font-semibold text-text">Live Reserve Auctions</h3>
              <p className="text-xs text-text-muted leading-relaxed font-light">
                Competitive real-time bidding with automatic outbid alerts and escrow deposit locks.
              </p>
            </div>

            <div className="rounded-card border border-border-subtle bg-surface p-7 shadow-gallery hover:border-accent/40 transition-all duration-300 space-y-3">
              <span className="font-mono text-xs font-semibold text-accent tracking-widest block">
                02
              </span>
              <h3 className="font-serif text-base font-semibold text-text">Collector Vault Showcase</h3>
              <p className="text-xs text-text-muted leading-relaxed font-light">
                Personalized digital portfolio with high-resolution viewing and verifiable certificates.
              </p>
            </div>

            <div className="rounded-card border border-border-subtle bg-surface p-7 shadow-gallery hover:border-accent/40 transition-all duration-300 space-y-3">
              <span className="font-mono text-xs font-semibold text-accent tracking-widest block">
                03
              </span>
              <h3 className="font-serif text-base font-semibold text-text">Immediate Settlement</h3>
              <p className="text-xs text-text-muted leading-relaxed font-light">
                Automated wallet accounting and immediate ownership transfer upon auction completion.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-serif text-xs uppercase tracking-catalog font-semibold text-accent">
              Patron Statements
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-text mt-1">
              Trusted by Premier Collectors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="rounded-card border border-border-subtle bg-surface p-8 sm:p-12 text-center shadow-gallery max-w-2xl mx-auto space-y-4">
          <span className="font-serif text-xs uppercase tracking-catalog font-semibold text-accent block">
            Curator Dispatch
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-text">
            Stay Ahead of Exclusive Lot Drops
          </h2>
          <p className="text-xs text-text-muted max-w-md mx-auto font-light leading-relaxed">
            Receive private notifications prior to public catalogue releases and curated digital exhibitions.
          </p>

          <form className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your collector email"
              required
              className="flex-1 rounded-card border border-border-subtle bg-surface-elevated text-text text-sm py-2.5 px-4 focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent transition-all placeholder:text-text-muted/70 min-h-[44px]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-card bg-primary hover:bg-primary-hover text-primary-foreground text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-gallery min-h-[44px]"
            >
              <span>Subscribe</span>
              <SendHorizonal className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>
      </div>

      <Footer />
    </main>
  );
}
