import { NextRequest, NextResponse } from "next/server";
import { type AppAbility, canUser } from "@/lib/permissions";
import { User } from "@/features/auth/types";

type Subject = Parameters<AppAbility["can"]>[1];

const protectedRoutes: Record<string, Subject> = {
  "/search": "SearchPage",
  "/trends": "TrendsPage",
  "/reports/submit": "SubmitReportPage",
  "/admin": "AdminPage",
  "/dashboard/overview": "OverviewPage",
  "/dashboard/reports": "MyReportsPage",
  "/dashboard/settings": "SettingsPage",
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

async function fetchUser(cookie: string): Promise<User | null> {
  try {
    const res = await fetch(`${API}/auth/whoami`, { headers: { Cookie: cookie } });
    if (!res.ok) return null;
    return await res.json() as User;
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

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const subject = protectedRoutes[pathname];

  const cookie = req.headers.get("cookie") ?? "";
  let user: User | null = null;
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

  const requestHeaders = new Headers(req.headers);

  if (subject) {
    if(!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth", "sign-in");
      return NextResponse.redirect(url);
    }
    if(!canUser(user, "view", subject)) {
      requestHeaders.set("x-forbidden", "true");
    }
  }

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