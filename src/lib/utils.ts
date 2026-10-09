import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = '₹'): string {
  if (isNaN(price)) return `${currency}0`;
  return `${currency}${Math.round(price).toLocaleString('en-IN')}`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function generateOrderNumber(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RW-${new Date().getFullYear()}-${random}`;
}

export function getEstimatedDeliveryDate(daysFromNow: number = 3): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
