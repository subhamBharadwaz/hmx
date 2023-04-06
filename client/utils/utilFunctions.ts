import { formatDistanceToNow, format } from "date-fns";

// Capitalize first letter
export const capitalizeFirstLetter = (string: string) => {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1);
};

// Format Date
export function formatDate(dateString: Date) {
  const now = new Date();
  const date = new Date(dateString); // ensure date is a valid Date object
  const diffInMonths = Math.round(
    (now.getTime() - date.getTime()) / (30 * 24 * 60 * 60 * 1000)
  );
  const diffInYears = now.getFullYear() - date.getFullYear();

  if (diffInYears > 1) {
    return format(date, "dd MMM, yyyy");
  } else {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}
