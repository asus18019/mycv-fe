import * as React from "react"

import { cn } from "@/lib/utils"

export type InputVariant = "default" | "ghost"
export type InputSize = "sm" | "default" | "lg"

const base =
  "w-full min-w-0 rounded-md text-foreground transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

const variants: Record<InputVariant, string> = {
  default: "border border-input bg-transparent focus-visible:border-ring dark:bg-input/30",
  ghost: "border border-transparent bg-transparent hover:border-input focus-visible:border-ring",
}

const sizes: Record<InputSize, string> = {
  sm: "h-8 px-2.5 text-xs",
  default: "h-9 px-3 text-sm",
  lg: "h-11 px-4 text-base",
}

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  variant?: InputVariant
  size?: InputSize
}

function Input({ className, type, variant = "default", size = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}

export { Input }