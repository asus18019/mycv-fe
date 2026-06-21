import type { User } from "@/features/auth/types";
import { useContext } from "react";
import { UserContext } from "@/components/user-provider";

export function useCurrentUser(): User | null {
  return useContext(UserContext);
}