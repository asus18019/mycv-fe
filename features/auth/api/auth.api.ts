import { api } from "@/lib/api";
import type { SignInSchema } from "@/features/auth/schemas/sign-in.schema";
import type { SignInResponse } from "@/features/auth/types";

export const authApi = {
  signIn: (data: SignInSchema) => api.post<SignInResponse>("/auth/signin", data),
};