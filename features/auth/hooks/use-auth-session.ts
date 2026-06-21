"use client";

import { useContext } from "react";
import { SessionContext } from "@/components/session-provider";
import type { AuthSession } from "@/features/auth/types";

export function useAuthSession(): AuthSession {
  const session = useContext(SessionContext);
  if(!session) {
    throw new Error("Session must be used only inside the session provider");
  }
  return session;
}