import { redirect } from "next/navigation";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAuthSession } from "@/features/auth/lib/get-auth-session";

const stats = [
  { label: "Reports Submitted", value: "—", icon: FileText },
  { label: "Approved", value: "—", icon: CheckCircle },
  { label: "Pending Review", value: "—", icon: Clock },
];

export async function OverviewTab() {
  const { isAuthenticated, user } = await getAuthSession();
  if(!isAuthenticated) redirect("/?auth=sign-in");
  const initials = user.email.slice(0, 2).toUpperCase() ?? "";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="bg-amber-100 text-lg font-semibold text-amber-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-zinc-900">{user.email}</p>
          <div className="mt-1">
            <Badge className={user.admin ? "bg-amber-100 text-amber-700" : ""}>
              {user.admin ? "Admin" : "User"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-zinc-200 p-5">
            <div className="flex items-center gap-2 text-zinc-400">
              <Icon className="size-4" />
              <span className="text-xs">{label}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-zinc-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}