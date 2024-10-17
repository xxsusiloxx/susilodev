import { describe, it, expect } from 'vitest';
import { cn, relativeTime, bytesToSize } from '@/lib/utils';
import dayjs from 'dayjs';

describe('Utils Functions add', () => {
  describe('cn', () => {
    it('should combine class names correctly', () => {
      expect(cn('text-lg', 'font-bold')).toBe('text-lg font-bold');
      expect(cn('text-lg', '', 'font-bold')).toBe('text-lg font-bold');
      expect(cn('text-lg', false, 'font-bold')).toBe('text-lg font-bold');
      expect(cn('text-lg', null, 'font-bold')).toBe('text-lg font-bold');
      expect(cn('text-lg', undefined, 'font-bold')).toBe('text-lg font-bold');
    });
  });

  describe('relativeTime', () => {
    it('should return the relative time from a given date', () => {
      const pastDate = dayjs().subtract(1, 'day').toISOString();
      expect(relativeTime(pastDate)).toBe('a day ago');

      const pastMinute = dayjs().subtract(1, 'minute').toISOString();
      expect(relativeTime(pastMinute)).toBe('a minute ago');
    });
  });

  describe('bytesToSize', () => {
    it('should return correct size format for bytes', () => {
      expect(bytesToSize(0)).toBe('n/a');
      expect(bytesToSize(500)).toBe('500 Bytes');
      expect(bytesToSize(1024)).toBe('1.0 KB');
      expect(bytesToSize(1048576)).toBe('1.0 MB');
      expect(bytesToSize(1073741824)).toBe('1.0 GB');
    });

    it('should return correct size format for larger units', () => {
      expect(bytesToSize(1099511627776)).toBe('1.0 TB');
    });
  });
});
