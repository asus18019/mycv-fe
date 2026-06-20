import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpSchema } from "@/features/auth/schemas/sign-up.schema";
import type { SignInSchema } from "@/features/auth/schemas/sign-in.schema";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";

export function SignUpForm() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => toast.success("Signed up successfully."),
    onError: (error) => {
      if(!(error instanceof ApiError)) return;
      if(error.status.toString().startsWith("4")) {
        setError("root", {
          message: "An account with this email already exists.",
        });
      }
    },
  })

  function onSubmit(data: SignInSchema) {
    mutate(data);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Confirm password</label>
        <input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
        {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      {errors.root && (
          <p className="mt-1 text-xs text-red-500">{errors.root.message}</p>
      )}
      </div>
      <Button variant="primary" className="w-full" disabled={isPending}>
        {isPending ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}