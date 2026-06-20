"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/features/auth/components/auth-modal";
import type { AuthView } from "@/features/auth/types";

interface AuthButtonsProps {
  user: Record<string, unknown> | null;
}

export function AuthButtons({ user }: AuthButtonsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('auth') as AuthView | null;
  const [view, setView] = useState<AuthView | null>(search);

  const handleSetView = (view: AuthView) => {
    setView(view);
    router.push(view ? `?auth=${view.toString()}` : "/");
  }

  if (user) {
    const email = user.email as string;
    const initials = email.slice(0, 2).toUpperCase();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-9 cursor-pointer">
            <AvatarFallback className="bg-amber-100 text-xs font-semibold text-amber-700">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-sm font-normal text-zinc-500">
            {email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="md" onClick={() => handleSetView("sign-in")}>
          Sign In
        </Button>
        <Button variant="primary" size="md" onClick={() => handleSetView("sign-up")}>
          Sign Up
        </Button>
      </div>

      <AuthModal
        open={view !== null}
        view={view ?? "sign-in"}
        setView={handleSetView}
        onOpenChange={(open) => !open && handleSetView(null)}
      />
    </>
  );
}