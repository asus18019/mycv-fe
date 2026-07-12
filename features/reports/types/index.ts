export interface CreateReportResponse {
  id: number;
  approved: boolean | null;
  price: number;
  make: string;
  model: string;
  year: number;
  lng: number;
  lat: number;
  mileage: number;
  userId: string;
  createdAt: string;
}

export interface UploadUrlRequest {
  filename: string;
  contentType: string;
  size: number;
}

export interface UploadUrlResponse {
  id: number;
  key: string;
  uploadUrl: string;
}

export interface ConfirmFilesResponse {
  succeeded: string[];
  failed: string[];
}