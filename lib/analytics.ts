export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function event(action: string, params?: Record<string, unknown>) {
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", action, {
    ...params,
  });
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
