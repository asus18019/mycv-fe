"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createReportSchema, type CreateReportSchema } from "@/features/reports/schemas/create-report.schema";
import { reportsApi } from "@/features/reports/api/reports.api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDigits, parseDigits } from "@/lib/format";
import { LocationPicker } from "@/features/reports/components/location-picker";
import { ReportAttachments, type ReportAttachmentsHandle } from "@/features/reports/components/report-attachments";
import { ReportSubmitted } from "@/features/reports/components/report-submitted";

const inputClass =
  "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-700";
const hintClass = "mt-1.5 text-xs text-zinc-400";
const errorClass = "mt-1.5 text-xs text-red-500";

function FormSection({
  title,
  description,
  children,
  fullWidthChild,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  fullWidthChild?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-4 py-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      <div className="space-y-4 md:col-span-2">{children}</div>
      {fullWidthChild}
    </div>
  );
}

export function CreateReportForm() {
  const [locating, setLocating] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attachmentsKey, setAttachmentsKey] = useState(0);
  const attachmentsRef = useRef<ReportAttachmentsHandle>(null);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<CreateReportSchema>({
    resolver: zodResolver(createReportSchema),
    defaultValues: { attachmentCount: 0 },
  });
  const lat = useWatch({ control, name: "lat" });
  const lng = useWatch({ control, name: "lng" });

  const { mutate, isPending } = useMutation({
    mutationFn: reportsApi.create,
    onSuccess: async (data) => {
      setUploadingAttachments(true);
      try {
        await attachmentsRef.current?.upload(data.id);
      } catch {
        toast.error("Report submitted, but attachments failed to upload.");
      } finally {
        setUploadingAttachments(false);
      }
      setSubmitted(true);
    },
    onError: (error) => {
      if (!(error instanceof ApiError)) return;
      if (error.status.toString().startsWith("4")) {
        setError("root", {
          message: "Couldn't submit your report. Please check the details and try again.",
        });
      }
    },
  });

  const isSubmitting = isPending || uploadingAttachments;

  function onSubmit(data: CreateReportSchema) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- client-only, not sent to the API
    const { consent, attachmentCount, ...payload } = data;
    mutate(payload);
  }

  function handleSubmitAnother() {
    reset();
    setMapExpanded(false);
    setAttachmentsKey((key) => key + 1);
    setSubmitted(false);
  }

  const handleFileCountChange = useCallback(
    (count: number) => setValue("attachmentCount", count, { shouldValidate: isSubmitted }),
    [setValue, isSubmitted]
  );

  function handleLocationChange(newLat: number, newLng: number) {
    setValue("lat", newLat, { shouldValidate: true });
    setValue("lng", newLng, { shouldValidate: true });
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationChange(position.coords.latitude, position.coords.longitude);
        setLocating(false);
      },
      () => {
        toast.error("Couldn't get your location.");
        setLocating(false);
      }
    );
  }

  if (submitted) {
    return <ReportSubmitted onSubmitAnother={handleSubmitAnother} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-zinc-200">
      <FormSection
        title="Vehicle details"
        description="Identify the car that was sold."
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="make" className={labelClass}>Make</label>
            <input
              id="make"
              type="text"
              placeholder="Toyota"
              {...register("make")}
              className={inputClass}
            />
            {errors.make && <p className={errorClass}>{errors.make.message}</p>}
          </div>
          <div>
            <label htmlFor="model" className={labelClass}>Model</label>
            <input
              id="model"
              type="text"
              placeholder="Camry"
              {...register("model")}
              className={inputClass}
            />
            {errors.model && <p className={errorClass}>{errors.model.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className={labelClass}>Year</label>
            <input
              id="year"
              type="number"
              placeholder="2019"
              {...register("year", { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.year && <p className={errorClass}>{errors.year.message}</p>}
          </div>
          <div>
            <label htmlFor="mileage" className={labelClass}>Mileage</label>
            <Controller
              control={control}
              name="mileage"
              render={({ field }) => (
                <div className="relative">
                  <input
                    id="mileage"
                    type="text"
                    inputMode="numeric"
                    placeholder="85,000"
                    value={formatDigits(field.value)}
                    onChange={(e) => field.onChange(parseDigits(e.target.value))}
                    onBlur={field.onBlur}
                    className={cn(inputClass, "pr-10")}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-zinc-400">
                    mi
                  </span>
                </div>
              )}
            />
            {errors.mileage && <p className={errorClass}>{errors.mileage.message}</p>}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Sale details"
        description="How much the car sold for."
      >
        <div>
          <label htmlFor="price" className={labelClass}>Sale price</label>
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
                  $
                </span>
                <input
                  id="price"
                  type="text"
                  inputMode="numeric"
                  placeholder="18,400"
                  value={formatDigits(field.value)}
                  onChange={(e) => field.onChange(parseDigits(e.target.value))}
                  onBlur={field.onBlur}
                  className={cn(inputClass, "pl-6")}
                />
              </div>
            )}
          />
          {errors.price ? (
            <p className={errorClass}>{errors.price.message}</p>
          ) : (
            <p className={hintClass}>The final price the car sold for, in USD.</p>
          )}
        </div>
      </FormSection>

      <FormSection
        title="Location"
        description="Where the sale took place. Used to tailor recommendations by region."
        fullWidthChild={
          <div className={cn("space-y-4", mapExpanded ? "md:col-span-3" : "md:col-span-2 md:col-start-2")}>
            <LocationPicker
                lat={lat}
                lng={lng}
                onChange={handleLocationChange}
                expanded={mapExpanded}
                onToggleExpanded={() => setMapExpanded((v) => !v)}
            />
            <p className={hintClass}>
              Click the map or drag the pin to mark roughly where the sale happened — city-level
              accuracy is fine, no need to find the exact address.
            </p>
          </div>
        }
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-700">Coordinates</p>
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 disabled:opacity-50"
          >
            {locating ? "Locating…" : "Use current location"}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <label htmlFor="lat" className="text-xs text-zinc-400">Lat</label>
            <input
              id="lat"
              type="number"
              step="any"
              placeholder="30.2672"
              {...register("lat", { valueAsNumber: true })}
              className="w-28 rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600 outline-none focus:border-zinc-400"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label htmlFor="lng" className="text-xs text-zinc-400">Lng</label>
            <input
              id="lng"
              type="number"
              step="any"
              placeholder="-97.7431"
              {...register("lng", { valueAsNumber: true })}
              className="w-28 rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600 outline-none focus:border-zinc-400"
            />
          </div>
        </div>
        {(errors.lat || errors.lng) && (
          <p className={errorClass}>{errors.lat?.message ?? errors.lng?.message}</p>
        )}
      </FormSection>

      <FormSection
        title="Attachments"
        description="Add at least one photo or document that supports the sale price, like a bill of sale or odometer photo."
      >
        <ReportAttachments
          key={attachmentsKey}
          ref={attachmentsRef}
          onFileCountChange={handleFileCountChange}
        />
        {errors.attachmentCount && <p className={errorClass}>{errors.attachmentCount.message}</p>}
      </FormSection>

      <div className="py-6">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-zinc-600">
          <input
            type="checkbox"
            {...register("consent")}
            className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-zinc-300 accent-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
          />
          <span className="leading-5">
            I consent to this data being used to calculate price recommendations for other users.
          </span>
        </label>
        {errors.consent && <p className={cn(errorClass, "ml-6.5")}>{errors.consent.message}</p>}
      </div>

      <div className="flex items-center justify-between py-6">
        <div>{errors.root && <p className={errorClass}>{errors.root.message}</p>}</div>
        <div className="flex items-center gap-3">
          {isSubmitting ? (
            <Button type="button" variant="secondary" disabled>
              Cancel
            </Button>
          ) : (
            <Link href="/dashboard/reports">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          )}
          <Button type="submit" variant="dark" disabled={isSubmitting}>
            {isPending ? "Submitting…" : uploadingAttachments ? "Uploading attachments…" : "Submit report"}
          </Button>
        </div>
      </div>
    </form>
  );
}