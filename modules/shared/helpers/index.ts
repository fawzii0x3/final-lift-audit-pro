import { format } from "date-fns";

export function ensureArray<T>(array: T[] | null | undefined): T[] {
  if (!array) {
    return [];
  }
  return array;
}

export function formatInspectionDate(dateString: string): string {
  return format(new Date(dateString), "dd/MM/yyyy");
}
