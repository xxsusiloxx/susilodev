import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeTime(dateAsString: string) {
  dayjs.extend(relativeTimePlugin);
  return dayjs(dateAsString).fromNow();
}
