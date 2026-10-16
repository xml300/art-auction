import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  comment: string;
  rating: number;
  image: string;
  date: string;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="rounded-card bg-surface p-7 border border-border-subtle shadow-gallery hover:border-accent/40 transition-all duration-300 flex flex-col justify-between text-left">
      <div>
        {/* Curatorial Quote Glyph */}
        <span className="font-serif text-3xl text-accent/50 leading-none select-none block mb-1">“</span>
        <p className="text-xs sm:text-sm text-text font-serif italic leading-relaxed text-text/90">
          {testimonial.comment}
        </p>
      </div>

      <div className="pt-5 mt-5 border-t border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={38}
            height={38}
            className="rounded-full object-cover ring-1 ring-border-strong"
          />
          <div>
            <p className="font-medium text-text text-xs tracking-wide">{testimonial.name}</p>
            <p className="text-[11px] text-text-muted font-light">{testimonial.position}</p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-text-muted/75 uppercase tracking-wider">
          {new Date(testimonial.date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
