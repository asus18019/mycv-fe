import { headers } from "next/headers";

export async function isForbidden(): Promise<boolean> {
  const headersList = await headers();
  return headersList.get("x-forbidden") === "true";
}