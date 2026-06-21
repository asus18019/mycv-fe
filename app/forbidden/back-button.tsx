"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  // @ts-ignore
  const goBack = navigation && navigation.canGoBack;

  return (
    <button
      onClick={() => goBack ? router.back() : router.push("/")}
      className="mt-8 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
    >
      {goBack ? "Go back" : "Go to homepage"}
    </button>
  );
}