import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TestimonialCard } from "@/components/TestimonialCard";
import { SendHorizonal } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const testimonials = [
    {
      "id": 1,
      "name": "Sarah Chen",
      "image": "/images/avatars/sarah-chen.jpg",
      "rating": 5,
      "date": "2024-09-15T10:00:00Z",
      "comment": "The support team was incredibly responsive and solved my issue within minutes. A truly seamless experience from start to finish!",
      "position": "Lead UX Designer at TechCorp"
    },
    {
      "id": 2,
      "name": "Marcus Rivas",
      "image": "/images/avatars/marcus-rivas.jpg",
      "rating": 4,
      "date": "2024-10-01T15:30:00Z",
      "comment": "Solid product with great features. The interface could be slightly more intuitive, but overall highly recommend it for professionals.",
      "position": "Senior Data Analyst, FinTrack"
    },
    {
      "id": 3,
      "name": "Aisha Khan",
      "image": "/images/avatars/aisha-khan.jpg",
      "rating": 5,
      "date": "2024-10-14T08:45:00Z",
      "comment": "Absolutely outstanding! The quality exceeded my expectations. I've already seen a huge difference in my productivity since adopting this tool.",
      "position": "CEO of Creative Solutions"
    },
    {
      "id": 4,
      "name": "David Lee",
      "image": "/images/avatars/david-lee.jpg",
      "rating": 5,
      "date": "2024-11-05T12:10:00Z",
      "comment": "Best in class performance and reliability. I appreciate the frequent updates and new integrations being rolled out.",
      "position": "Software Architect, Global Systems"
    },
    {
      "id": 5,
      "name": "Emily Watson",
      "image": "/images/avatars/emily-watson.jpg",
      "rating": 3,
      "date": "2024-11-20T09:05:00Z",
      "comment": "It meets our basic needs well, but some of the advanced features are difficult to configure. Good value for the price, though.",
      "position": "Project Manager, Retail Innovations"
    },
    {
      "id": 6,
      "name": "Javier Perez",
      "image": "/images/avatars/javier-perez.jpg",
      "rating": 5,
      "date": "2024-12-03T17:22:00Z",
      "comment": "Incredible customer service and a fantastic community behind the product. It made my migration process effortless.",
      "position": "Independent Consultant"
    },
    {
      "id": 7,
      "name": "Nina Sharma",
      "image": "/images/avatars/nina-sharma.jpg",
      "rating": 4,
      "date": "2025-01-08T11:40:00Z",
      "comment": "The feature set is robust and the API integration was surprisingly easy. Highly recommended for development teams.",
      "position": "CTO, NextGen Labs"
    },
    {
      "id": 8,
      "name": "Chris Bell",
      "image": "/images/avatars/chris-bell.jpg",
      "rating": 5,
      "date": "2025-01-25T14:55:00Z",
      "comment": "After trying several competitors, this is the one we stuck with. It's fast, stable, and perfectly scalable for our needs.",
      "position": "Founder, Bell Ventures"
    },
    {
      "id": 9,
      "name": "Olivia Moore",
      "image": "/images/avatars/olivia-moore.jpg",
      "rating": 4,
      "date": "2025-02-10T16:07:00Z",
      "comment": "The onboarding process was excellent and the documentation is top-notch. Docking one star for a small bug I found, but it was quickly addressed.",
      "position": "Marketing Director, HealthPath"
    },
    {
      "id": 10,
      "name": "Kenji Tanaka",
      "image": "/images/avatars/kenji-tanaka.jpg",
      "rating": 5,
      "date": "2025-03-01T09:15:00Z",
      "comment": "A reliable, beautifully designed solution. It handles high traffic with zero issues. My go-to choice from now on.",
      "position": "Operations Manager, Aero Dynamics"
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <section className="flex-1 mx-12 my-6 gap-y-4">
        <section id="hero" className="relative bg-[url('/logo.png')] flex flex-col justify-center items-center text-white rounded-2xl px-12 py-16 h-[80vh]">
          <div className="z-20 text-center">
            <h1 className="text-9xl font-boldf">Welcome to <span className="italic text-transparent bg-gradient-to-r from-red-800 to-red-200 bg-clip-text pr-6">Artsyl</span></h1>
            <p className="text-2xl font-light mt-2 italic">Your premier platform for luxury digital art auctions</p>
          </div>
          <div className="absolute w-full h-full top-0 left-0 z-10 bg-black/50"></div>
        </section>
        <section id="about" className="text-center shadow-md p-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 items-center">
            <div>
              <Image
                src="/logo.png"
                alt="Featured artwork"
                width={240}
                height={240}
                className="rounded-lg mx-auto"
              />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-2xl mb-2">About Artsyl</h2>
              <p className="text-base mb-4">
                Artsyl is a curated marketplace for luxury digital art and limited-edition NFTs.
                We connect collectors, galleries, and artists through transparent auctions,
                expert curation, and secure transactions.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Curated collections from emerging and established artists</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Secure bidding and verified provenance</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-800 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 7h18M3 12h18M3 17h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Easy-to-use dashboard for buyers and sellers</span>
                </li>
              </ul>
              <div>
                <button className="rounded-full bg-red-700 px-6 py-2 text-white">Learn More</button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="text-center shadow-md p-6">
          <h2 className="font-bold text-2xl mb-4">Platform Features</h2>
          <p className="max-w-2xl mx-auto mb-6">Built for collectors and creators — discover, bid, and own exceptional digital art.</p>
          <div className="max-w-4xl mx-auto grid gap-4 grid-cols-1 md:grid-cols-3 px-6">
            <div className="rounded-md bg-white text-black flex flex-col items-start p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-8 h-8 text-red-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 9h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="font-semibold">Curated Auctions</h3>
              </div>
              <p className="text-sm">Hand-picked lots with expert curation to ensure quality and rarity.</p>
            </div>
            <div className="rounded-md bg-white text-black flex flex-col items-start p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-8 h-8 text-red-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 20v-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="font-semibold">Verified Provenance</h3>
              </div>
              <p className="text-sm">Transparent history and ownership records for every piece.</p>
            </div>
            <div className="rounded-md bg-white text-black flex flex-col items-start p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-8 h-8 text-red-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 3v18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="font-semibold">Secure Bidding</h3>
              </div>
              <p className="text-sm">Real-time bids with secure checkout and escrow options.</p>
            </div>
          </div>
        </section>
        <section id="testimonials" className="text-center shadow-md p-6">
          <h2 className="font-bold text-xl">Our Testimonials</h2>
          <div className="grid grid-cols-4 gap-4 px-6 my-6">
            {testimonials.slice(0, 8).map(testimonial => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
          </div>
          <button className="bg-red-800 px-12 py-4 rounded-full text-white ">Get Started Now</button>
        </section>
        <section id="newsletter" className="shadow-md p-6 min-h-48 flex flex-col justify-center items-center gap-x-6">
          <h2 className="font-bold italic text-4xl mb-2">Join our Newsletter</h2>
          <p className="text-lg mb-1 w-52 text-center">Stay updated with the latest art auctions and news.</p>
          <div className="flex justify-center items-center gap-2"><input type="email" placeholder="Enter email" className="border-2 border-black rounded-3xl px-6 py-2" /> <button className="bg-red-800 text-white p-2 rounded-full"><SendHorizonal /></button></div>
        </section>
      </section>
      <Footer />
    </main>
  );
}
