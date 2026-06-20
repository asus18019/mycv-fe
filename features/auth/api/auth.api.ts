import { api } from "@/lib/api";
import type { SignInSchema } from "@/features/auth/schemas/sign-in.schema";
import type { SignInResponse, SignUpPayload } from "@/features/auth/types";

export const authApi = {
  signIn: (data: SignInSchema) => api.post<SignInResponse>("/auth/signin", data),
  signUp: (data: SignUpPayload) => api.post<SignInResponse>("/auth/signup", data),
  signOut: () => api.post("/auth/signout"),
  getOauthUri: () => api.get<{ uri: string }>("/oauth/google"),
};