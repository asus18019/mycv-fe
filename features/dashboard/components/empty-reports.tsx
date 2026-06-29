import Link from "next/link";
import { FileText } from "lucide-react";

export function EmptyReports() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center">
      <FileText className="mb-3 size-8 text-zinc-300" />
      <p className="text-sm font-medium text-zinc-700">No reports yet</p>
      <p className="mt-1 text-sm text-zinc-400">
        Submit a sale report and it will appear here.
      </p>
      <Link
        href="/reports/submit"
        className="mt-5 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Submit a Report
      </Link>
    </div>
  );
}