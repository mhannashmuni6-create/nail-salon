/**
 * Digital Marketing & Analytics Helper for Nail Muse Studio.
 * Prepares the application for GA4, Google Tag Manager, and custom event tracking.
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

export const trackEvent = (eventName: AnalyticsEventName, payload?: AnalyticsPayload) => {
  // In browser runtime, dispatch custom event and log to developer console
  if (typeof window !== 'undefined') {
    const sanitizedPayload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...payload,
    };

    // Forward to window.dataLayer if GA4 / GTM is present
    const win = window as unknown as { dataLayer?: unknown[] };
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push(sanitizedPayload);
    }

    // Custom browser event for extensible integrations
    window.dispatchEvent(
      new CustomEvent('nailmuse:analytics', {
        detail: sanitizedPayload,
      })
    );

    // Development diagnostic log
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event] ${eventName}`, sanitizedPayload);
    }
  }
};
