import React from "react";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { getAuthSession } from "@/features/auth/lib/get-auth-session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = await getAuthSession();

  if (!isAuthenticated) {
    redirect("/?auth=sign-in");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your account and reports</p>
      </div>
      <div className="flex gap-10">
        <DashboardNav />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}