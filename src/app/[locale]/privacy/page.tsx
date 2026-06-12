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
  const t = await getTranslations({ locale, namespace: "privacy.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localePath(locale, "/privacy"),
      languages: {
        es: localePath("es", "/privacy"),
        en: localePath("en", "/privacy"),
        "pt-BR": localePath("pt-BR", "/privacy"),
        ja: localePath("ja", "/privacy"),
        ko: localePath("ko", "/privacy"),
        "x-default": localePath("es", "/privacy"),
      },
    },
    openGraph: { title: t("title"), description: t("description"), type: "website" },
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const sections = [
    "intro",
    "localProcessing",
    "noDataCollection",
    "cookies",
    "thirdParty",
    "security",
    "changes",
    "contact",
  ] as const;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <header className="space-y-2">
        <p className="label-mono text-brand">// PRIVACY_POLICY</p>
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
      </header>
      {sections.map((key) => (
        <section key={key} className="space-y-3">
          <h2 className="text-xl font-semibold">{t(`${key}.heading`)}</h2>
          {key === "noDataCollection" ? (
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {(t.raw("noDataCollection.items") as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground leading-relaxed">{t(`${key}.body`)}</p>
          )}
        </section>
      ))}
    </div>
  );
}
