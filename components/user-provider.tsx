"use client";

import { createContext } from "react";
import type { User } from "@/features/auth/types";

export const UserContext = createContext<User | null>(null);

export function UserProvider({ user, children, }: {
  user: User | null;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
