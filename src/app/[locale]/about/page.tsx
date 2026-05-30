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
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localePath("es", "/about"),
      languages: {
        es: localePath("es", "/about"),
        en: localePath("en", "/about"),
        "pt-BR": localePath("pt-BR", "/about"),
        ja: localePath("ja", "/about"),
        ko: localePath("ko", "/about"),
        "x-default": localePath("es", "/about"),
      },
    },
    openGraph: { title: t("title"), description: t("description"), type: "website" },
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <header className="space-y-2">
        <p className="label-mono text-brand">{t("label")}</p>
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("whatIs")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("whatIsDesc")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("mission")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("missionDesc")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("privacy")}</h2>
        <p className="text-muted-foreground leading-relaxed">{t("privacyDesc")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("development")}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t("developmentDesc")}{" "}
          <a
            href="https://binarycore.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            {t("linkBinaryCore")}
          </a>
        </p>
      </section>
    </div>
  );
}
