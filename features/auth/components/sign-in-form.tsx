"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInSchema, type SignInSchema } from "@/features/auth/schemas/sign-in.schema";
import { authApi } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";

export function SignInForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      if(!(error instanceof ApiError)) return;
      if(error.status.toString().startsWith("4")) {
        setError("root", {
          message: "Invalid email or password."
        });
      }
    },
  });

  function onSubmit(data: SignInSchema) {
    mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      {errors.root && (
          <p className="mt-1 text-xs text-red-500">{errors.root.message}</p>
      )}
      <div className="flex justify-end">
        <button type="button" className="text-xs text-zinc-500 hover:text-zinc-900">
          Forgot password?
        </button>
      </div>
      <Button type="submit" variant="dark" className="w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign In"}
      </Button>

      <GoogleSignInButton />
    </form>
  );
}