import { headers } from "next/headers";
import { OverviewTab } from "@/features/dashboard/components/overview-tab";

export default async function OverviewPage() {
  const headersList = await headers();
  const user = JSON.parse(headersList.get("x-user") ?? "null");

  return <OverviewTab user={user} />;
}