import { NextRequest, NextResponse } from "next/server";
import { defineAbilityFor, type Role, type AppAbility } from "@/lib/permissions";

type Subject = Parameters<AppAbility["can"]>[1];

const protectedRoutes: Record<string, Subject> = {
  "/search": "SearchPage",
  "/trends": "TrendsPage",
  "/reports/submit": "SubmitReportPage",
  "/admin": "AdminPage",
  "/dashboard": "DashboardPage",
};

async function fetchUser(req: NextRequest) {
  if (!req.cookies.has("accessToken")) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/whoami`, {
      headers: { Cookie: req.headers.get("cookie") ?? "" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getRole(user: unknown): Role {
  if(!user) {
    return "guest";
  }
  // @ts-ignore
  if(user.admin) {
    return "admin";
  }
  return "user";
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const subject = Object.entries(protectedRoutes).find(
    ([route]) => pathname === route || pathname.startsWith(route + "/")
  )?.[1];

  const user = await fetchUser(req);
  const role = getRole(user);
  const ability = defineAbilityFor(role);

  if (subject && !ability.can("view", subject)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("auth", "sign-in");
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(req.headers);
  if (user) {
    requestHeaders.set("x-user", JSON.stringify(user));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
