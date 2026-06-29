import { EmptyReports } from "./empty-reports";
import { ReportsTable } from "./reports-table";
import { Report } from "@/features/dashboard/types";

const mockReports: Report[] = [
  {
    id: 1,
    approved: true,
    price: 18500,
    make: "Toyota",
    model: "Camry",
    year: 2019,
    lng: -87.6298,
    lat: 41.8781,
    mileage: 54000,
    userId: "user-001",
    createdAt: "2026-05-10T09:00:00Z",
  },
  {
    id: 2,
    approved: false,
    price: 12300,
    make: "Honda",
    model: "Civic",
    year: 2017,
    lng: -118.2437,
    lat: 34.0522,
    mileage: 78000,
    userId: "user-001",
    createdAt: "2026-06-01T14:30:00Z",
  },
  {
    id: 3,
    approved: null,
    price: 27900,
    make: "Ford",
    model: "Explorer",
    year: 2021,
    lng: -73.9857,
    lat: 40.7484,
    mileage: 31000,
    userId: "user-001",
    createdAt: "2026-06-20T11:15:00Z",
  },
  {
    id: 4,
    approved: true,
    price: 22400,
    make: "BMW",
    model: "3 Series",
    year: 2020,
    lng: -122.4194,
    lat: 37.7749,
    mileage: 41000,
    userId: "user-001",
    createdAt: "2026-04-03T08:20:00Z",
  },
  {
    id: 5,
    approved: null,
    price: 9800,
    make: "Chevrolet",
    model: "Malibu",
    year: 2015,
    lng: -80.1918,
    lat: 25.7617,
    mileage: 112000,
    userId: "user-001",
    createdAt: "2026-06-25T16:45:00Z",
  },
  {
    id: 6,
    approved: false,
    price: 31500,
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2022,
    lng: -95.3698,
    lat: 29.7604,
    mileage: 18000,
    userId: "user-001",
    createdAt: "2026-05-18T11:00:00Z",
  },
  {
    id: 7,
    approved: true,
    price: 15700,
    make: "Nissan",
    model: "Altima",
    year: 2018,
    lng: -112.0740,
    lat: 33.4484,
    mileage: 67000,
    userId: "user-001",
    createdAt: "2026-03-22T13:10:00Z",
  },
  {
    id: 8,
    approved: null,
    price: 41000,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    lng: -122.0838,
    lat: 37.3861,
    mileage: 9000,
    userId: "user-001",
    createdAt: "2026-06-28T09:30:00Z",
  },
];

export function ReportsTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-medium text-zinc-900">My Reports</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Sale reports you have submitted for review.
        </p>
      </div>

      {mockReports.length ? <ReportsTable reports={mockReports} /> : <EmptyReports />}
    </div>
  );
}