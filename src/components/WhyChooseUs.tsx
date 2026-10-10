import { CheckCircle, ShieldCheck, Star } from "lucide-react";

const features = [
  {
    name: "Verified & Authentic Art",
    description:
      "Every piece of digital art is verified for authenticity by our team of curators, ensuring you invest with confidence.",
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
  },
  {
    name: "Exclusive Curated Lots",
    description:
      "Gain direct access to limited-edition drops from world-renowned contemporary artists and rising digital luminaries.",
    icon: <Star className="w-5 h-5 text-primary" />,
  },
  {
    name: "Transparent Auction Ledger",
    description:
      "Our platform provides real-time, transparent bidding with tamper-proof records from initial reserve to final hammer.",
    icon: <CheckCircle className="w-5 h-5 text-primary" />,
  },
];

export const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            The Artsyl Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text mt-1">
            Why Discerning Collectors Choose Us
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-text-muted">
            Built from the ground up for luxury digital art provenance, escrow, and curated acquisitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-3"
            >
              <div className="p-3 bg-primary/10 rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-text">{feature.name}</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
