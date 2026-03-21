"use client";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useState } from "react";

export default function AuthSection({error}: {error: string}) {
    const [accType, setAcctype] = useState("login");

    return (
        <>
            <section className="relative bg-secondary bg-opacity-30 flex w-48 mx-auto justify-between rounded-full cursor-pointer p-1 mb-4">
                <button onClick={() => setAcctype('login')} className={`z-10 px-6 py-2 font-medium transition-all duration-300 cursor-pointer ${accType === 'login' ? 'text-white' : 'text-text'}`}>
                    Login
                </button>
                <button onClick={() => setAcctype('register')} className={`z-10 px-6 py-2 font-medium transition-all duration-300 cursor-pointer ${accType === 'register' ? 'text-white' : 'text-text'}`}>
                    Register
                </button>
                <div className={`bg-primary w-1/2 h-full rounded-full absolute left-0 top-0 transition-transform duration-300 ${accType === 'login' ? 'translate-x-0' : 'translate-x-full'}`}></div>
            </section>
            <section className="mt-4">
                {accType === 'login' ? <LoginForm error={error} setAccType={setAcctype} /> : <RegisterForm error={error} setAccType={setAcctype} />}
            </section>
        </>
    );
}