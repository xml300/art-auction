"use client";

import { ErrorContext } from "@/contexts/ErrorContext";
import { useState } from "react";

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [error, setError] = useState<string | null>(null);
    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    );
};