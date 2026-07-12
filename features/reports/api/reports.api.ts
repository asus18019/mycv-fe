import { api } from "@/lib/api";
import type { CreateReportSchema } from "@/features/reports/schemas/create-report.schema";
import type { CreateReportResponse, UploadUrlRequest, UploadUrlResponse } from "@/features/reports/types";

export const reportsApi = {
  create: (data: CreateReportSchema) =>
    api.post<CreateReportResponse>("/reports", data),
  getUploadUrls: (reportId: number, files: UploadUrlRequest[]) =>
    api.post<UploadUrlResponse[]>(`/reports/${reportId}/files/upload-url`, files),
};