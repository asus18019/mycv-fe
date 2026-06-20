import { SignUpSchema } from "@/features/auth/schemas/sign-up.schema";

export type AuthView = "sign-in" | "sign-up" | null;

export interface SignInResponse {
  accessToken: string;
}

export type SignUpPayload = Omit<SignUpSchema, "confirmPassword">