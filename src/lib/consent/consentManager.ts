declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type ConsentState = {
  analytics: boolean;
  adsense: boolean;
  timestamp: number;
};

const STORAGE_KEY = "synthnode-cookie-consent";

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as ConsentState;
    return parsed;
  } catch {
    return null;
  }
}

export function setConsent(state: ConsentState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateGoogleConsent(state);
  } catch {
    // Silenciar error en producción
  }
}

export function hasConsent(): boolean {
  return getConsent() !== null;
}

export function updateGoogleConsent(state: ConsentState): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.adsense ? "granted" : "denied",
    ad_user_data: state.adsense ? "granted" : "denied",
    ad_personalization: state.adsense ? "granted" : "denied",
  });
}
