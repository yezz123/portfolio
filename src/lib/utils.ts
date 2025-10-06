import { format } from "date-fns";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely format a date string, handling invalid dates gracefully
 */
export function safeDateFormat(
  dateString: string | null | undefined,
  formatString: string = "MMM yyyy",
): string {
  if (!dateString || dateString === "present" || dateString === "null") {
    return "Present";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`);
      return "Invalid Date";
    }
    return format(date, formatString);
  } catch (error) {
    console.warn(`Error formatting date: ${dateString}`, error);
    return "Invalid Date";
  }
}

/**
 * Safely format a date range, handling null/undefined end dates
 */
export function safeDateRangeFormat(
  startDate: string,
  endDate?: string | null,
): string {
  const formattedStart = safeDateFormat(startDate, "MMM yyyy");

  if (!endDate || endDate === "present" || endDate === "null") {
    return `${formattedStart} - Present`;
  }

  const formattedEnd = safeDateFormat(endDate, "MMM yyyy");
  return `${formattedStart} - ${formattedEnd}`;
}
