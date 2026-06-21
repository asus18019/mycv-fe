import { headers } from "next/headers";
import type { User } from "@/features/auth/types";

export async function getCurrentUser(): Promise<User | null> {
  const headersList = await headers();
  return JSON.parse(headersList.get("x-user") ?? "null");
}