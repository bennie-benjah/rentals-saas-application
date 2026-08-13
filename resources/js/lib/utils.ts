import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Required by the starter kit's own components (e.g. nav-footer.tsx).
// Normalizes a nav link's href, which can be a plain string or a Wayfinder
// route object ({ url, method }), down to a plain URL string.
export function toUrl(href: string | { url: string; method?: string }): string {
  return typeof href === "string" ? href : href.url;
}
