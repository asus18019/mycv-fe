import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportSubmittedProps {
  onSubmitAnother: () => void;
}

export function ReportSubmitted({ onSubmitAnother }: ReportSubmittedProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check className="size-7" strokeWidth={3} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-zinc-900">Report submitted</h2>
        <p className="text-sm leading-relaxed text-zinc-500">
          Thanks — your report is now pending review by our team. <br/>
          Once it&apos;s approved, it will be included in future price recommendations. <br/>
          You can check on its status anytime from My reports.
        </p>
      </div>
      <div className="flex items-center gap-3">
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