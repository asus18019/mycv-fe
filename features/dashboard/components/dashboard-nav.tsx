"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { canUser, type Pages } from "@/lib/permissions";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";

const navItems: { label: string; href: string; icon: LucideIcon; subject: Pages }[] = [
  { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard, subject: "OverviewPage" },
  { label: "My Reports", href: "/dashboard/reports", icon: FileText, subject: "MyReportsPage" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, subject: "SettingsPage" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuthSession();

  const allowedItems = navItems.filter(({ subject }) => canUser(user, "view", subject));

  return (
    <nav className="w-44 shrink-0 border-r border-zinc-200 pr-6">
      <ul className="flex flex-col gap-0.5">
        {allowedItems.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
                pathname === href
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}