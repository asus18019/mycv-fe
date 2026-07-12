export function formatDigits(value: number | undefined): string {
  return value === undefined || Number.isNaN(value) ? "" : value.toLocaleString("en-US");
}

export function parseDigits(value: string): number | undefined {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : undefined;
}