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

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

async function fetchUser(cookie: string): Promise<unknown | null> {
  try {
    const res = await fetch(`${API}/auth/whoami`, { headers: { Cookie: cookie } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function refreshTokens(cookie: string): Promise<Response | null> {
  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    if (!res.ok) return null;
    return res;
  } catch {
    return null;
  }
}

function getRole(user: unknown): Role {
  if (!user) return "guest";
  // @ts-ignore
  if (user.admin) return "admin";
  return "user";
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const subject = Object.entries(protectedRoutes).find(
    ([route]) => pathname === route || pathname.startsWith(route + "/")
  )?.[1];

  console.log(`[proxy] ${req.method} ${pathname}`);

  const cookie = req.headers.get("cookie") ?? "";
  let user: unknown = null;
  let setCookie: string | null = null;

  if (req.cookies.has("accessToken")) {
    user = await fetchUser(cookie);
  }

  if (!user && req.cookies.has("refreshToken")) {
    const refreshRes = await refreshTokens(cookie);
    if (refreshRes) {
      setCookie = refreshRes.headers.get("set-cookie");
      user = await fetchUser(setCookie ?? cookie);
    }
  }

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

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.map$).*)"],
};