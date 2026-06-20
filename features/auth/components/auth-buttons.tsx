"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/features/auth/components/auth-modal";
import type { AuthView } from "@/features/auth/types";

export function AuthButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('auth') as AuthView | null;
  const [view, setView] = useState<AuthView | null>(search);

  const handleSetView = (view: AuthView) => {
    setView(view);
    router.push(view ? `?auth=${view.toString()}` : "/");
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