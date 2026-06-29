import { ReportsTab } from "@/features/dashboard/components/reports-tab";

interface ReportsPageProps {
  searchParams: Promise<{ search?: string; page?: string; sort?: string; pageSize?: string }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { search, page, sort, pageSize } = await searchParams;
  return <ReportsTab search={search} page={page} sort={sort} pageSize={pageSize} />;
}