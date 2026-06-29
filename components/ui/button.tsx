import { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "dark" | "outline" | "secondary" | "ghost";
type ButtonSize = "sm" | "default" | "md" | "lg" | "icon";

const base = "inline-flex items-center justify-center rounded-md text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-amber-400 text-zinc-900 hover:bg-amber-300",
  dark: "bg-zinc-900 text-white hover:bg-zinc-700",
  outline: "border border-zinc-700 text-zinc-300 text-black hover:border-zinc-500",
  secondary: "border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3",
  default: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-12 px-7",
  icon: "size-6",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export function Button({ variant = "primary", size = "lg", asChild = false, className = "", ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}