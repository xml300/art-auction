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
        {/* Modern Minimal Hero */}
        <section
          id="hero"
          className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[420px] sm:min-h-[480px] flex items-center justify-center p-8 sm:p-12 shadow-md animate-fade-in"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-blue-200 border border-blue-400/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Luxury Digital Auctions
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Collect Exceptional <br />
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text">
                Digital Masterpieces
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-light max-w-lg mx-auto leading-relaxed">
              Experience transparent bidding, verified provenance, and direct access to world-renowned digital artists.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auth"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-sm active:scale-95"
              >
                Explore Curated Lots
              </Link>
              <Link
                href="#about"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md transition-all border border-white/10 active:scale-95"
              >
                Learn How It Works
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
          className="rounded-3xl border border-border-subtle bg-surface p-8 sm:p-12 shadow-xs"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden bg-surface-elevated border border-border-subtle p-6 flex items-center justify-center shadow-xs">
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
              <span className="text-xs uppercase font-bold tracking-wider text-primary">
                About the Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
                Setting the Standard for Digital Fine Art
              </h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Artsyl is a curated auction platform connecting esteemed collectors with visionary digital creators. Each artwork passes strict authenticity scrutiny before entering live bidding.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text">Verified Provenance</h4>
                    <p className="text-[11px] text-text-muted">Unbroken chain of custody for every minted piece.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text">Expert Curation</h4>
                    <p className="text-[11px] text-text-muted">Strictly limited releases selected by advisory curators.</p>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/auth"
                  className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors shadow-xs"
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
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text mt-1">
              Built for Modern Digital Collecting
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-text">Live Reserve Auctions</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Competitive real-time bidding with automatic outbid alerts and escrow deposit locks.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-text">Collector Vault Showcase</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Personalized digital portfolio with high-resolution viewing and verifiable certificates.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-text">Immediate Settlement</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Automated wallet accounting and immediate ownership transfer upon auction completion.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              Community Reviews
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text mt-1">
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
        <section className="rounded-3xl border border-border-subtle bg-surface p-8 sm:p-12 text-center shadow-xs max-w-2xl mx-auto space-y-4">
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Curator Dispatch
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Stay Ahead of Exclusive Lot Drops
          </h2>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            Receive private notifications prior to public catalogue releases and curated digital exhibitions.
          </p>

          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 rounded-xl border border-border-subtle bg-surface-elevated text-text text-sm py-2.5 px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted/60"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
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
