"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { Session, initialsFromName, nameFromEmail } from "@/lib/auth";

type ResolvedUser = {
  email: string;
  name: string;
  initials: string;
  tenant: string;
};

const SessionContext = createContext<ResolvedUser | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  const value = useMemo<ResolvedUser | null>(() => {
    if (!session) return null;
    const name = nameFromEmail(session.email);
    return {
      email: session.email,
      name,
      initials: initialsFromName(name),
      tenant: session.tenant,
    };
  }, [session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): ResolvedUser | null {
  return useContext(SessionContext);
}
