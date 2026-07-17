import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpSchema } from "@/features/auth/schemas/sign-up.schema";
import type { SignInSchema } from "@/features/auth/schemas/sign-in.schema";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api";

export function SignUpForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
    },
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
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Confirm password</label>
        <Input
            type="password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
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
      <GoogleSignInButton />
    </form>
  );
}