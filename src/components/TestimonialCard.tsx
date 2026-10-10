import Image from "next/image";
import { Star } from "lucide-react";

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
    <div className="rounded-2xl bg-surface p-6 border border-border-subtle shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        <div className="flex gap-1 mb-3">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-xs text-text-muted leading-relaxed line-clamp-4 italic">
          &ldquo;{testimonial.comment}&rdquo;
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={40}
            height={40}
            className="rounded-full object-cover ring-2 ring-primary/20"
          />
          <div>
            <p className="font-semibold text-text text-xs">{testimonial.name}</p>
            <p className="text-[11px] text-text-muted">{testimonial.position}</p>
          </div>
        </div>

        <span className="text-[10px] text-text-muted">
          {new Date(testimonial.date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
