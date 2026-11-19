/**
 * Digital Marketing & Analytics Helper for Nail Muse Studio.
 * Dispatches GA4 events directly via gtag.js (G-9VMM3MVD2Z) without duplicate dataLayer pushes.
 * Strictly adheres to privacy guidelines: never transmits personal information (PII).
 */

type AnalyticsEventName =
  | 'book_now_click'
  | 'service_view'
  | 'gallery_interaction'
  | 'booking_request_submit'
  | 'contact_form_submit'
  | 'page_view';

interface AnalyticsPayload {
  [key: string]: string | number | boolean | undefined;
}

type GtagFunction = (
  command: 'event' | 'config' | 'js',
  targetOrName: string | Date,
  params?: Record<string, string | number | boolean>
) => void;

export const trackEvent = (eventName: AnalyticsEventName, payload?: AnalyticsPayload) => {
  if (typeof window === 'undefined') return;

  // Strip undefined properties so GA4 receives clean event parameters
  const cleanParams: Record<string, string | number | boolean> = {};
  if (payload) {
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanParams[key] = value;
      }
    });
  }

  const win = window as unknown as {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  };

  // Forward directly to GA4 via gtag() (which manages dataLayer internally to prevent duplicates)
  if (typeof win.gtag === 'function') {
    win.gtag('event', eventName, cleanParams);
  }

  const diagnosticDetail = {
    event: eventName,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    ...cleanParams,
  };

  // Custom browser event for extensible local diagnostics
  window.dispatchEvent(
    new CustomEvent('nailmuse:analytics', {
      detail: diagnosticDetail,
    })
  );

  // Development diagnostic log
  if (import.meta.env.DEV) {
    console.log(`[Analytics Event] ${eventName}`, diagnosticDetail);
  }
};
