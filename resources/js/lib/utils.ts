import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const rupiah = (number: number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
  }

export function formatDate(date: Date | string): string {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short', // Abbreviated weekday name (Mon)
        day: '2-digit', // Two-digit day (11)
        month: 'short', // Full month name (June)
        year: 'numeric', // Full year (2024)
    };

    const d = new Date(date);
    return d.toLocaleDateString('en-GB', options);
}


