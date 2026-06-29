export interface StatsResponse {
  total: number;
  approved: number;
  pending: number;
}

export interface Report {
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