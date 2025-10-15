import Image from "next/image";
import { Star, StarOff } from "lucide-react";
import { Long_Cang } from "next/font/google";

interface Testimonial {
    id: number;
    name: string;
    position: string;
    comment: string;
    rating: number;
    image: string;
    date: string;
}


export function TestimonialCard({ testimonial, key }: { testimonial: Testimonial, key: number | string }) {
    return (
        <div key={key} className="rounded-md bg-gray-50 shadow-md text-black flex flex-col justify-center items-center px-4 py-2 pt-6">
            <p className="flex mb-2">{[...Array(testimonial.rating)].map((_, i) => <Star key={i} />)}</p>
            <p className="break-words italic text-base font-light">"{testimonial.comment}"</p>
            <div className="flex gap-x-2 my-2">
                <Image src={testimonial.image} alt={testimonial.name} width={40} height={40} className="rounded-full bg-black h-[40px]" />
                <div className="text-left text-sm">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="italic">{testimonial.position}</p>
                </div>
            </div>
            <p className="text-xs text-right italic w-full">{new Date(testimonial.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        </div>
    );
}