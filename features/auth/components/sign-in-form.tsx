"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signInSchema, type SignInSchema } from "@/features/auth/schemas/sign-in.schema";
import { authApi } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api";

export function SignInForm() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: () => toast.success("Signed in successfully."),
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
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
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
    </form>
  );
}