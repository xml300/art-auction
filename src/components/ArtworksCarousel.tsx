"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react"; 
import { Artwork } from "@/data/db";

export function ArtworkCarousel({artworks, className}: {artworks: Artwork[], className?: string}){
    const [index, setIndex] = useState(0);
    const linkRef = useRef<HTMLAnchorElement | null>(null);

    function handleButtonLeft(){
        setIndex(idx => Math.max(idx - 1, 0));
       
    };

    function handleButtonRight(){
        setIndex(idx => Math.min(idx + 1, artworks.length - 1));
    };

    return (
         <section className={`mx-auto flex overflow-hidden  max-w-5xl mt-8 rounded-3xl relative ${className}`}>
                {artworks.slice(index, index + 1).map(artwork => (
                    <Link ref={linkRef} href={`/dashboard/my-artworks/${artwork.id}`} key={artwork.id} className="w-full h-[48rem] flex-shrink-0 cursor-pointer relative transition-transform">
                        <Image src={artwork.imageUrl} width={800} height={800} alt={artwork.title} className="bg-black/60 h-full w-full" />
                        <div className="absolute bottom-0 text-white p-6 bg-gradient-to-b from-transparent to-black w-full">
                            <h3 className="text-3xl font-semibold">{artwork.title}</h3>
                            <p className="text-xl">{artwork.description} </p>
                        </div>
                    </Link>
                ))}
                <button className="absolute top-1/2 left-5 text-white bg-black/70 rounded-full p-2" disabled={index === 0} onClick={handleButtonLeft}><ArrowLeft className={`${index === 0 ? 'text-gray-500': ''}`} /></button>
                <button className="absolute top-1/2 right-5 text-white bg-black/70 rounded-full p-2" disabled={index === artworks.length - 1} onClick={handleButtonRight}><ArrowRight  className={`${index === artworks.length - 1 ? 'text-gray-500': ''}`} /></button>
            </section>
    );
}