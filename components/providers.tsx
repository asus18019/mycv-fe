import { QueryProvider } from "@/components/query-provider";
import { UserProvider } from "@/components/user-provider";
import { getCurrentUser } from "@/lib/get-current-user";

export async function Providers({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <QueryProvider>
      <UserProvider user={user}>
        {children}
      </UserProvider>
    </QueryProvider>
  );
}