import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BASE_URL } from "@/lib/constants/site";

interface Props {
  params: Promise<{ locale: string }>;
}

function localePath(locale: string, path: string): string {
  return `${BASE_URL}${locale === "es" ? "" : `/${locale}`}${path}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localePath("es", "/legal"),
      languages: {
        es: localePath("es", "/legal"),
        en: localePath("en", "/legal"),
        "pt-BR": localePath("pt-BR", "/legal"),
        ja: localePath("ja", "/legal"),
        ko: localePath("ko", "/legal"),
        "x-default": localePath("es", "/legal"),
      },
    },
    openGraph: { title: t("title"), description: t("description"), type: "website" },
  };
}

export default async function LegalPage() {
  const t = await getTranslations("legal");
  const sections = [
    "owner",
    "purpose",
    "liability",
    "intellectualProperty",
    "governing",
    "contact",
  ] as const;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <header className="space-y-2">
        <p className="label-mono text-brand">// LEGAL_NOTICE</p>
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
      </header>
      {sections.map((key) => (
        <section key={key} className="space-y-3">
          <h2 className="text-xl font-semibold">{t(`${key}.heading`)}</h2>
          <p className="text-muted-foreground leading-relaxed">{t(`${key}.body`)}</p>
        </section>
      ))}
    </div>
  );
}
