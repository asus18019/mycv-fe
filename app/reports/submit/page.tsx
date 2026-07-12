import type { Metadata } from "next";
import { CreateReportForm } from "@/features/reports/components/create-report-form";

export const metadata: Metadata = {
  title: "Submit a Sale Report — DealSense",
  description: "Report a car sale to help improve price recommendations.",
};

export default function SubmitReportPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="border-b border-zinc-200 pb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Submit a sale report</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Tell us about a car you sold. Once approved, it helps improve price
          recommendations for everyone.
        </p>
      </div>
      <CreateReportForm />
    </div>
  );
}