import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatPrice as formatCurrencyPrice, type CurrencyCode } from '@/lib/currency';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number, currency: CurrencyCode = 'USD', locale = 'en-US'): string {
  return formatCurrencyPrice(cents, currency, locale);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getBeatStats(beat: { bpm: number; mood: string[] }): {
  attack: number;
  defense: number;
  speed: number;
  special: number;
} {
  // Generate deterministic stats from beat properties
  const seed = beat.bpm + beat.mood.join('').length;
  return {
    attack: Math.min(10, Math.max(1, (seed % 10) + 1)),
    defense: Math.min(10, Math.max(1, ((seed * 7) % 10) + 1)),
    speed: Math.min(10, Math.max(1, Math.floor(beat.bpm / 15))),
    special: Math.min(10, Math.max(1, ((seed * 13) % 10) + 1)),
  };
}
