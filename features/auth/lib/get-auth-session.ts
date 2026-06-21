import { headers } from "next/headers";
import type { AuthSession, User } from "@/features/auth/types";

export async function getAuthSession(): Promise<AuthSession> {
  const headersList = await headers();
  const user: User | null = JSON.parse(headersList.get("x-user") ?? "null");
  return user ?
      { isAuthenticated: true, user } :
      { isAuthenticated: false, user: null };
}