import { z } from "zod";

const currentYear = new Date().getFullYear();

export const createReportSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number("Year is required")
    .min(1900, "Year must be 1900 or later")
    .max(currentYear, `Year must be ${currentYear} or earlier`),
  price: z
    .number("Price is required")
    .min(1, "Price must be at least $1")
    .max(1_000_000, "Price must be at most $1,000,000"),
  mileage: z
    .number("Mileage is required")
    .min(0, "Mileage cannot be negative")
    .max(5_000_000, "Mileage must be at most 5,000,000"),
  lat: z
    .number("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  lng: z
    .number("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  consent: z
    .boolean()
    .refine((value) => value, "You must consent to data processing to submit a report"),
  attachmentCount: z
    .number()
    .min(1, "Attach at least one photo or document to submit a report"),
  additionalInfo: z
    .string()
    .max(1000, "Additional information must be at most 1,000 characters")
    .optional(),
});

export type CreateReportSchema = z.infer<typeof createReportSchema>;