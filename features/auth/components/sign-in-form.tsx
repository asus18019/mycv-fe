"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { signInSchema, type SignInSchema } from "@/features/auth/schemas/sign-in.schema";

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  function onSubmit(data: SignInSchema) {
    console.log(data);
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
      <div className="flex justify-end">
        <button type="button" className="text-xs text-zinc-500 hover:text-zinc-900">
          Forgot password?
        </button>
      </div>
      <Button type="submit" variant="dark" className="w-full">Sign In</Button>
    </form>
  );
}