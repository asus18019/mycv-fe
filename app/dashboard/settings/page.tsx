import { headers } from "next/headers";
import { SettingsTab } from "@/features/dashboard/components/settings-tab";

export default async function SettingsPage() {
  const headersList = await headers();
  const user = JSON.parse(headersList.get("x-user") ?? "null");

  return <SettingsTab user={user} />;
}