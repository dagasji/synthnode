"use client";

import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";

export default function CookieSettingsButton() {
  const t = useTranslations("cookieSettings");

  const handleClick = () => {
    const event = new CustomEvent("open-cookie-banner");
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-40 p-3 bg-background border border-border rounded-full shadow-lg hover:bg-accent transition-colors"
      aria-label={t("manage")}
      title={t("manage")}
    >
      <Cookie size={20} className="text-foreground" />
    </button>
  );
}
