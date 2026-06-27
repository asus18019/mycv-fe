import { api } from "@/lib/api";
import { StatsResponse } from "@/features/dashboard/types";

export const dashboardApi = {
  getStats: (from?: Date, to?: Date) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from.toISOString());
    if (to) params.set("to", to.toISOString());
    const query = params.size ? `?${params}` : "";
    return api.get<StatsResponse>(`/reports/stats${query}`);
  },
}