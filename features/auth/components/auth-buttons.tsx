"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/features/auth/components/auth-modal";
import type { AuthView } from "@/features/auth/types";

export function AuthButtons() {
  const [view, setView] = useState<AuthView | null>(null);

  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="md" onClick={() => setView("sign-in")}>
          Sign In
        </Button>
        <Button variant="primary" size="md" onClick={() => setView("sign-up")}>
          Sign Up
        </Button>
      </div>

      <AuthModal
        open={view !== null}
        view={view ?? "sign-in"}
        setView={setView}
        onOpenChange={(open) => !open && setView(null)}
      />
    </>
  );
}