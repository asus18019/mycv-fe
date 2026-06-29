import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timeout } from "@radix-ui/primitive";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: Timeout;
  return function(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(null, args), delay);
  }
}