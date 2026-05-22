"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";

const LOCALES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt-BR", label: "PT" },
  { code: "ja", label: "JA" },
  { code: "ko", label: "KO" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common.language");

  const changeLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    const currentLocale = segments[1];

    if (currentLocale === newLocale) return;

    if (currentLocale && LOCALES.some((l) => l.code === currentLocale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    router.push(segments.join("/"));
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-label={t("switch")}
      >
        <Languages className="size-4" />
        <span>{locale.toUpperCase()}</span>
      </button>
      <div className="absolute right-0 top-full mt-2 w-32 bg-surface border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {LOCALES.map((loc) => (
          <button
            key={loc.code}
            onClick={() => changeLocale(loc.code)}
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
              locale === loc.code
                ? "bg-brand text-background font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>
    </div>
  );
}
