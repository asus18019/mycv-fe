import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportSubmittedProps {
  onSubmitAnother: () => void;
}

export function ReportSubmitted({ onSubmitAnother }: ReportSubmittedProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check className="size-6" strokeWidth={3} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Report submitted</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Thanks — your report is now pending review.
        </p>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Button variant="secondary" onClick={onSubmitAnother}>
          Submit another
        </Button>
        <Link href="/dashboard/reports">
          <Button variant="dark">View my reports</Button>
        </Link>
      </div>
    </div>
  );
}