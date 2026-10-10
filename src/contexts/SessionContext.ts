import { createContext, Dispatch, SetStateAction } from "react";

export interface Session {
  userId: number;
  roleId: number;
  username: string;
  email?: string;
  roleName?: string;
  profilePicture: string | null;
}

export interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  setSession: Dispatch<SetStateAction<Session | null>>;
  refreshSession: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | null>(null);