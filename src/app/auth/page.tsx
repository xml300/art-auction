'use client';
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import ArtistForm from "./ArtistForm";
import CollectorForm from "./CollectorForm";
import Link  from "next/link";



export default function AuthPage() {
    const searchParams = useSearchParams();
    const [accType, setAccType] = useState(searchParams.get('acc_type') || 'collector');


    return (
        <main className="flex flex-col min-h-screen justify-center items-center">
            <Link href="/">
                <Image src="/logo.png" width={100} height={100} alt="Logo" />
            </Link>

            <div className=" w-[70%] mx-auto rounded-lg shadow-lg p-12">
                <section className="relative bg-red-400 flex w-48 mx-auto justify-between rounded-full cursor-pointer">
                    <input type="radio" id="artist" name="options" className="sr-only" checked={accType === 'artist'} onChange={() => setAccType('artist')} />
                    <input type="radio" id="collector" name="options" className="sr-only peer" checked={accType === 'collector'} onChange={() => setAccType('collector')} />
                    <label htmlFor="artist" className="z-10 px-6 py-3 text-white peer-checked:text-black">Artist</label>
                    <label htmlFor="collector" className="z-10 px-6 py-3 peer-checked:text-white">Collector</label>
                    <div className="bg-red-900  px-12 py-6 rounded-full absolute left-0 transition-transform duration-300 translate-x-0 peer-checked:translate-x-full"></div>
                </section>
                <section className="mt-4">
                    {accType == 'artist' ? <ArtistForm /> : <CollectorForm />}
                </section>
            </div>
        </main>
    );
}