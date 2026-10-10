"use client";

import { useState, useEffect, useCallback } from "react";
import { SessionContext, Session } from "@/contexts/SessionContext";

export default function SessionProvider({
  children,
  initialSession = null,
}: {
  children: React.ReactNode;
  initialSession?: Session | null;
}) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [isLoading, setIsLoading] = useState<boolean>(!initialSession);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setSession({
            userId: data.user.id || data.user.userId,
            roleId: data.user.roleId,
            username: data.user.username,
            email: data.user.email,
            roleName: data.user.roleName,
            profilePicture: data.user.profilePicture,
          });
        }
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialSession) {
      refreshSession();
    }
  }, [initialSession, refreshSession]);

  return (
    <SessionContext.Provider value={{ session, setSession, isLoading, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
}