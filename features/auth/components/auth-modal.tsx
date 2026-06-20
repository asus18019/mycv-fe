"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import type { AuthView } from "@/features/auth/types";

interface AuthModalProps {
  open: boolean;
  view?: AuthView;
  setView: (view: AuthView) => void;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, view = "sign-in", setView, onOpenChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            <span className="text-zinc-900">Deal</span>
            <span className="text-amber-400">Sense</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-6 border-b border-zinc-200">
          {(["sign-in", "sign-up"] as AuthView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`pb-3 text-sm font-medium transition-colors ${
                view === v
                  ? "border-b-2 border-zinc-900 text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {v === "sign-in" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {view === "sign-in" ? <SignInForm /> : <SignUpForm />}
      </DialogContent>
    </Dialog>
  );
}