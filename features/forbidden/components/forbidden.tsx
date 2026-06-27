import { BackButton } from "@/features/forbidden/components/back-button";

export default function Forbidden() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">403</p>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Access denied</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-500">
        This page doesn&apos;t exist or you don&apos;t have permission to view it.
      </p>
      <BackButton />
    </div>
  );
}