"use client";

import { createContext } from "react";
import type { AuthSession } from "@/features/auth/types";

export const SessionContext = createContext<AuthSession | null>(null);

export function SessionProvider({ session, children, }: {
  session: AuthSession;
  children: React.ReactNode;
}) {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
