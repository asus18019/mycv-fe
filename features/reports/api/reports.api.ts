import { api } from "@/lib/api";
import type { CreateReportSchema } from "@/features/reports/schemas/create-report.schema";
import type { CreateReportResponse } from "@/features/reports/types";

export const reportsApi = {
  create: (data: CreateReportSchema) =>
    api.post<CreateReportResponse>("/reports", data),
};