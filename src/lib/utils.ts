import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeTime(dateAsString: string) {
  dayjs.extend(relativeTimePlugin);
  return dayjs(dateAsString).fromNow();
}

export function bytesToSize(bytes: number): string {
  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i: number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
