import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "dark" | "outline" | "secondary";
type ButtonSize = "md" | "lg";

const base = "inline-flex items-center justify-center rounded-md text-sm font-semibold cursor-pointer";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-amber-400 text-zinc-900 hover:bg-amber-300",
  dark: "bg-zinc-900 text-white hover:bg-zinc-700",
  outline: "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white",
  secondary: "border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-6",
  lg: "h-12 px-7",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = "primary", size = "lg", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}