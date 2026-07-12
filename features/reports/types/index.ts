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