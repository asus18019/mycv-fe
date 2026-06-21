import { SignUpSchema } from "@/features/auth/schemas/sign-up.schema";

export type AuthView = "sign-in" | "sign-up" | null;

export interface User {
  id: string;
  email: string;
  admin: boolean;
  version: number;
}

export interface SignInResponse {
  accessToken: string;
}

export type SignUpPayload = Omit<SignUpSchema, "confirmPassword">