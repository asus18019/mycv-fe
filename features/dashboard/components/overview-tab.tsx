import { redirect } from "next/navigation";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAuthSession } from "@/features/auth/lib/get-auth-session";
import { dashboardApi } from "@/features/dashboard/api/dashboard.api";
import { cn } from "@/lib/utils";

export async function OverviewTab() {
  const { isAuthenticated, user } = await getAuthSession();
  if(!isAuthenticated) redirect("/?auth=sign-in");
  const initials = user.email.slice(0, 2).toUpperCase() ?? "";

  const data = await dashboardApi.getStats();
  const stats = [
    { label: "Reports Submitted", value: data.total, icon: FileText, iconCls: "text-blue-600", bgCls: "bg-blue-50" },
    { label: "Approved", value: data.approved, icon: CheckCircle, iconCls: "text-emerald-600", bgCls: "bg-emerald-50" },
    { label: "Pending Review", value: data.pending, icon: Clock, iconCls: "text-amber-600", bgCls: "bg-amber-50" },
  ];

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
        {stats.map(({ label, value, icon: Icon, iconCls, bgCls }) => (
          <div key={label} className="rounded-xl border border-zinc-200 p-5">
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="relative flex items-center justify-center">
                <div className={cn("absolute p-3 rounded-2xl", bgCls)} />
                <Icon className={cn("relative size-4", iconCls)} />
              </div>
              <span className="text-xs">{label}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-zinc-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}