"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  getConsent,
  hasConsent,
  setConsent,
  type ConsentState,
} from "@/lib/consent/consentManager";

export default function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [adsense, setAdsense] = useState(false);

  useEffect(() => {
    if (!hasConsent()) {
      setIsVisible(true);
    }

    const handleOpenBanner = () => {
      const currentConsent = getConsent();
      if (currentConsent) {
        setAnalytics(currentConsent.analytics);
        setAdsense(currentConsent.adsense);
      }
      setShowSettings(true);
      setIsVisible(true);
    };

    window.addEventListener("open-cookie-banner", handleOpenBanner);

    return () => {
      window.removeEventListener("open-cookie-banner", handleOpenBanner);
    };
  }, []);

  const handleAcceptAll = () => {
    const consent: ConsentState = {
      analytics: true,
      adsense: true,
      timestamp: Date.now(),
    };
    setConsent(consent);
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const consent: ConsentState = {
      analytics: false,
      adsense: false,
      timestamp: Date.now(),
    };
    setConsent(consent);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consent: ConsentState = {
      analytics,
      adsense,
      timestamp: Date.now(),
    };
    setConsent(consent);
    setIsVisible(false);
  };

  const handleConfigure = () => {
    setShowSettings(true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 md:p-6 transition-transform"
    >
      <div className="container mx-auto max-w-6xl">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 id="cookie-banner-title" className="text-lg font-semibold mb-2">
                {t("title")}
              </h2>
              <p className="text-sm text-muted-foreground">{t("description")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {t("acceptAll")}
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="px-4 py-2 bg-background border border-border rounded-md hover:bg-accent transition-colors text-sm font-medium"
              >
                {t("rejectNonEssential")}
              </button>
              <button
                onClick={handleConfigure}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                {t("configure")}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 id="cookie-banner-title" className="text-lg font-semibold mb-2">
                  {t("title")}
                </h2>
                <p className="text-sm text-muted-foreground">{t("description")}</p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 py-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("essential")}</span>
                <span className="text-xs text-muted-foreground">Siempre activas</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("analytics")}</span>
                <button
                  onClick={() => setAnalytics(!analytics)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    analytics ? "bg-primary" : "bg-border"
                  }`}
                  aria-pressed={analytics}
                  aria-label={`${analytics ? "Desactivar" : "Activar"} Google Analytics`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      analytics ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("adsense")}</span>
                <button
                  onClick={() => setAdsense(!adsense)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    adsense ? "bg-primary" : "bg-border"
                  }`}
                  aria-pressed={adsense}
                  aria-label={`${adsense ? "Desactivar" : "Activar"} Google AdSense`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      adsense ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {t("save")}
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
