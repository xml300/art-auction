import { createContext, Dispatch, SetStateAction } from "react";

export interface Session {
    userId: number;
    roleId: number;
    username: string;
    profilePicture: string | null;
}

interface SessionContextType {
    session: Session | null;
    setSession: Dispatch<SetStateAction<Session | null>>;
}

export const SessionContext = createContext<SessionContextType | null>(null);