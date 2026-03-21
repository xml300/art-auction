import { createContext, Dispatch, SetStateAction } from "react";

interface ErrorContextType { 
    error: string | null; 
    setError: Dispatch<SetStateAction<string | null>>;
}
    
export const ErrorContext = createContext<ErrorContextType | null>(null);