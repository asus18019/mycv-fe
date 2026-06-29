import { api } from "@/lib/api";
import { GetReportsResponse, StatsResponse } from "@/features/dashboard/types";

export const dashboardApi = {
  getStats: (from?: Date, to?: Date) => {
    const params = new URLSearchParams();
    if(from) params.set("from", from.toISOString());
    if(to) params.set("to", to.toISOString());
    const query = params.size ? `?${params}` : "";
    return api.get<StatsResponse>(`/reports/stats${query}`);
  },
  getReports: (search?: string, page?: string, sort?: string, pageSize?: string) => {
    const params = new URLSearchParams();
    if(search) params.set("search", search);
    if(page) params.set("page", page);
    if(sort) params.set("sort", sort);
    if(pageSize) params.set("pageSize", pageSize);
    const query = params.size ? `?${params}` : "";
    return api.get<GetReportsResponse>(`/reports${query}`);
  },
}