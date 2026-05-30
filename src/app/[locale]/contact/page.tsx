import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BASE_URL } from "@/lib/constants/site";
import { ContactForm } from "@/components/contact/ContactForm";

interface Props {
  params: Promise<{ locale: string }>;
}

function localePath(locale: string, path: string): string {
  return `${BASE_URL}${locale === "es" ? "" : `/${locale}`}${path}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: localePath("es", "/contact"),
      languages: {
        es: localePath("es", "/contact"),
        en: localePath("en", "/contact"),
        "pt-BR": localePath("pt-BR", "/contact"),
        ja: localePath("ja", "/contact"),
        ko: localePath("ko", "/contact"),
        "x-default": localePath("es", "/contact"),
      },
    },
    openGraph: { title: t("title"), description: t("description"), type: "website" },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 space-y-10">
      <header className="space-y-2">
        <p className="label-mono text-brand">// CONTACT</p>
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground leading-relaxed">{t("subtitle")}</p>
      </header>
      <div className="space-y-6">
        <div className="bg-muted/50 p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-1">{t("bugCard.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("bugCard.description")}</p>
        </div>
        <div className="bg-muted/50 p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-1">{t("suggestionCard.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("suggestionCard.description")}</p>
        </div>
        <div className="bg-muted/50 p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-4">{t("formCard.title")}</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
