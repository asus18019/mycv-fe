import Link from "next/link";
import { headers } from "next/headers";
import { AuthButtons } from "@/features/auth/components/auth-buttons";
import { UserMenu } from "@/features/auth/components/user-menu";


const navLinks = [
  { label: "Search Price", href: "/search" },
  { label: "Market Trends", href: "/trends" },
  { label: "Submit Report", href: "/reports/submit" },
  { label: "About", href: "/about" },
];

export async function Header() {
  const headersList = await headers();
  const user = JSON.parse(headersList.get("x-user") ?? "null");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center text-2xl font-bold tracking-tight">
          <span className="text-zinc-900">Deal</span>
          <span className="text-amber-400">Sense</span>
        </Link>
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-zinc-600 hover:text-zinc-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {user ? <UserMenu user={user} /> : <AuthButtons />}
        </div>
      </div>
    </header>
  );
}