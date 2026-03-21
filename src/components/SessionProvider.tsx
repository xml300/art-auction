"use client";

import { useState } from "react";
import { SessionContext, Session } from "@/contexts/SessionContext";

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    
    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}