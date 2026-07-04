import { NoReportsFound } from "./no-reports-found";
import { ReportsTable } from "./reports-table";
import { getAuthSession } from "@/features/auth/lib/get-auth-session";
import { redirect } from "next/navigation";
import { dashboardApi } from "@/features/dashboard/api/dashboard.api";

export async function ReportsTab({ search, page, sort, pageSize }: { search?: string, page?: string, sort?: string, pageSize?: string }) {
  const { isAuthenticated } = await getAuthSession();
  if(!isAuthenticated) redirect("/?auth=sign-in");
  const data = await dashboardApi.getReports(search, page, sort, pageSize);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-medium text-zinc-900">My Reports</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Sale reports you have submitted for review.
        </p>
      </div>

      {data.unfilteredTotal ? (
        <ReportsTable
          reports={data.reports}
          total={data.total}
          unfilteredTotal={data.unfilteredTotal}
        />
      ) : (
        <NoReportsFound />
      )}
    </div>
  );
}