import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TestimonialCard } from "@/components/TestimonialCard";
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { ArtworkCarousel } from '@/components/ArtworksCarousel';
import { SendHorizonal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getArtworks } from "@/data/db";

export default function Home() {
  const testimonials = [
    {
      "id": 1,
      "name": "Sarah Chen",
      "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 5,
      "date": "2024-09-15T10:00:00Z",
      "comment": "The support team was incredibly responsive and solved my issue within minutes. A truly seamless experience from start to finish!",
      "position": "Lead UX Designer at TechCorp"
    },
    {
      "id": 2,
      "name": "Marcus Rivas",
      "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 4,
      "date": "2024-10-01T15:30:00Z",
      "comment": "Solid product with great features. The interface could be slightly more intuitive, but overall highly recommend it for professionals.",
      "position": "Senior Data Analyst, FinTrack"
    },
    {
      "id": 3,
      "name": "Aisha Khan",
      "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 5,
      "date": "2024-10-14T08:45:00Z",
      "comment": "Absolutely outstanding! The quality exceeded my expectations. I've already seen a huge difference in my productivity since adopting this tool.",
      "position": "CEO of Creative Solutions"
    },
    {
      "id": 4,
      "name": "David Lee",
      "image": "https://images.unsplash.com/photo-1508214751196-cdfd462dab18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 5,
      "date": "2024-11-05T12:10:00Z",
      "comment": "Best in class performance and reliability. I appreciate the frequent updates and new integrations being rolled out.",
      "position": "Software Architect, Global Systems"
    },
    {
      "id": 5,
      "name": "Emily Watson",
      "image": "https://images.unsplash.com/photo-1520452343136-f88205a2900b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 3,
      "date": "2024-11-20T09:05:00Z",
      "comment": "It meets our basic needs well, but some of the advanced features are difficult to configure. Good value for the price, though.",
      "position": "Project Manager, Retail Innovations"
    },
    {
      "id": 6,
      "name": "Javier Perez",
      "image": "https://images.unsplash.com/photo-1535713875002-d1d0cfce72b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 5,
      "date": "2024-12-03T17:22:00Z",
      "comment": "Incredible customer service and a fantastic community behind the product. It made my migration process effortless.",
      "position": "Independent Consultant"
    },
    {
      "id": 7,
      "name": "Nina Sharma",
      "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 4,
      "date": "2025-01-08T11:40:00Z",
      "comment": "The feature set is robust and the API integration was surprisingly easy. Highly recommended for development teams.",
      "position": "CTO, NextGen Labs"
    },
    {
      "id": 8,
      "name": "Chris Bell",
      "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 5,
      "date": "2025-01-25T14:55:00Z",
      "comment": "After trying several competitors, this is the one we stuck with. It's fast, stable, and perfectly scalable for our needs.",
      "position": "Founder, Bell Ventures"
    },
    {
      "id": 9,
      "name": "Olivia Moore",
      "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 4,
      "date": "2025-02-10T16:07:00Z",
      "comment": "The onboarding process was excellent and the documentation is top-notch. Docking one star for a small bug I found, but it was quickly addressed.",
      "position": "Marketing Director, HealthPath"
    },
    {
      "id": 10,
      "name": "Kenji Tanaka",
      "image": "https://images.unsplash.com/photo-1507003211169-e695c6bdd610?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "rating": 5,
      "date": "2025-03-01T09:15:00Z",
      "comment": "A reliable, beautifully designed solution. It handles high traffic with zero issues. My go-to choice from now on.",
      "position": "Operations Manager, Aero Dynamics"
    }
  ];
  const artworks = getArtworks();

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-dark-background text-black dark:text-dark-text">
      <Header />
      <section className="flex-1 my-6 px-4 sm:px-6 lg:px-8 gap-y-4">
        <section id="hero" className="mb-24 sm:mb-32 relative bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center flex flex-col justify-center items-center text-white py-20 sm:py-24 md:py-32 h-[60vh] sm:h-[70vh] lg:h-[80vh] opacity-0 animate-fade-in">
          <div className="z-20 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight">Welcome to <span className="italic text-transparent bg-gradient-to-r from-red-800 to-red-200 bg-clip-text pr-4">Artsyl</span></h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mt-4 italic">Your premier platform for luxury digital art auctions</p>
            <Link href="/auth" className="mt-8 inline-block bg-red-700 hover:bg-red-600 text-white text-md sm:text-lg md:text-xl px-8 py-3 sm:px-10 sm:py-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">Explore Artworks</Link>
          </div>
          <div className="absolute w-full h-full top-0 left-0 z-10 bg-black/50"></div>
        </section>
        <section id="about" className="text-center shadow-md py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-background opacity-0 animate-fade-in-delay-1">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="/logo.png"
                alt="Featured artwork"
                width={200}
                height={200}
                className="rounded-lg mx-auto"
              />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-4xl sm:text-5xl mb-4">About Artsyl</h2>
              <p className="text-lg sm:text-xl mb-4">
                Artsyl is a curated marketplace for luxury digital art and limited-edition NFTs.
                We connect collectors, galleries, and artists through transparent auctions,
                expert curation, and secure transactions.
              </p>
              <ul className="space-y-3 mb-8 text-lg sm:text-xl">
                <li key="curated-collections" className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Curated collections from emerging and established artists</span>
                </li>
                <li key="secure-provenance" className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Secure bidding and verified provenance</span>
                </li>
                <li key="easy-dashboard" className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 7h18M3 12h18M3 17h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Easy-to-use dashboard for buyers and sellers</span>
                </li>
              </ul>
              <div>
                <Link href="/about" className="rounded-full bg-red-700 px-8 py-3 text-white text-lg sm:text-xl">Learn More</Link>
              </div>
            </div>
          </div>
        </section>
        <WhyChooseUs />
        <ArtworkCarousel artworks={artworks} className="hidden lg:flex" />
        <section id="features" className="py-16 sm:py-24 bg-white dark:bg-dark-background opacity-0 animate-fade-in-delay-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Platform Features
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Built for collectors and creators — discover, bid, and own exceptional digital art.
            </p>
            <div className="mt-16 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-8">
              <div key="curated-auctions" className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full mb-4">
                  <svg className="w-12 h-12 text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 9h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Curated Auctions</h3>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Hand-picked lots with expert curation to ensure quality and rarity.</p>
              </div>
              <div key="verified-provenance" className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full mb-4">
                  <svg className="w-12 h-12 text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 20v-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Verified Provenance</h3>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Transparent history and ownership records for every piece.</p>
              </div>
              <div key="secure-bidding" className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full mb-4">
                  <svg className="w-12 h-12 text-red-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3v18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Secure Bidding</h3>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Real-time bids with secure checkout and escrow options.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="text-center shadow-md max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-background opacity-0 animate-fade-in-delay-3">
          <h2 className="font-bold text-4xl sm:text-5xl">Our Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 sm:px-6 my-12">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          <Link href="/auth" className="bg-red-800 px-12 py-4 rounded-full text-white text-xl sm:text-2xl">Get Started Now</Link>
        </section>
        <section id="newsletter" className="shadow-md p-8 sm:p-12 min-h-48 flex flex-col justify-center items-center gap-y-6 sm:gap-y-8 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-background opacity-0 animate-fade-in-delay-4">
          <h2 className="font-bold italic text-4xl sm:text-5xl mb-2">Join our Newsletter</h2>
          <p className="text-lg sm:text-xl text-center mb-8">Stay updated with the latest art auctions and news.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 w-full max-w-2xl">
            <input type="email" placeholder="Enter email" className="w-full sm:w-[70%] border-2 border-black dark:border-dark-secondary rounded-full p-4 sm:p-6 text-black dark:text-dark-text dark:bg-dark-background text-lg sm:text-xl" /> 
            <button className="bg-red-800 text-white p-4 sm:p-6 rounded-full flex items-center justify-center">
              <SendHorizonal className="w-8 h-8 sm:w-10 sm:h-10" />
            </button>
          </div>
        </section>
      </section>
      <Footer />
    </main>
  );
}
