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
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center text-center">
            <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current text-yellow-400" />
                ))}
            </div>
            <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">&ldquo;{testimonial.comment}&rdquo;</p>
            <div className="flex items-center gap-x-4 mt-auto">
                <Image src={testimonial.image} alt={testimonial.name} width={56} height={56} className="rounded-full object-cover border-2 border-red-500" />
                <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white text-xl">{testimonial.name}</p>
                    <p className="text-md text-gray-600 dark:text-gray-400">{testimonial.position}</p>
                </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {new Date(testimonial.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    );
}
