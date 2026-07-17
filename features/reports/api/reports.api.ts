import { api } from "@/lib/api";
import type { CreateReportSchema } from "@/features/reports/schemas/create-report.schema";
import type {
  ConfirmFilesResponse,
  CreateReportResponse,
  UploadUrlRequest,
  UploadUrlResponse,
} from "@/features/reports/types";

export const reportsApi = {
  create: (data: Omit<CreateReportSchema, "consent" | "attachmentCount">) =>
    api.post<CreateReportResponse>("/reports", data),
  getUploadUrls: (reportId: number, files: UploadUrlRequest[]) =>
    api.post<UploadUrlResponse[]>(`/files/report/${reportId}/upload-url`, files),
  confirmFiles: (reportId: number, keys: string[]) =>
    api.post<ConfirmFilesResponse>(`/files/report/${reportId}/confirm`, keys.map((key) => ({ key }))
    ),
};