"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type CheckboxSize = "sm" | "default"

const sizes: Record<CheckboxSize, { root: string; icon: string }> = {
  sm: { root: "size-3.5", icon: "size-3" },
  default: { root: "size-4", icon: "size-3.5" },
}

interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  size?: CheckboxSize
}

function Checkbox({ className, size = "default", ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer shrink-0 cursor-pointer rounded border border-input bg-transparent outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        sizes[size].root,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <CheckIcon className={sizes[size].icon} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }