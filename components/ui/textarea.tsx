import * as React from "react"

import { cn } from "@/lib/utils"
import type { InputSize, InputVariant } from "@/components/ui/input"

const base =
  "w-full min-w-0 resize-y rounded-md text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

const variants: Record<InputVariant, string> = {
  default: "border border-input bg-transparent focus-visible:border-ring dark:bg-input/30",
  ghost: "border border-transparent bg-transparent hover:border-input focus-visible:border-ring",
}

const sizes: Record<InputSize, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  default: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
}

interface TextareaProps extends React.ComponentProps<"textarea"> {
  variant?: InputVariant
  size?: InputSize
}

function Textarea({ className, variant = "default", size = "default", ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}

export { Textarea }