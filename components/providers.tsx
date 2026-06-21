import { QueryProvider } from "@/components/query-provider";
import { SessionProvider } from "@/components/session-provider";
import { getAuthSession } from "@/features/auth/lib/get-auth-session";

export async function Providers({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  return (
    <QueryProvider>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    </QueryProvider>
  );
}