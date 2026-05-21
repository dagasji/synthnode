import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SearchClient } from "@/components/search/search-client";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; tag?: string; since?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search.meta" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", category = "all", tag = "", since = "all" } = await searchParams;
  const t = await getTranslations("search");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <header className="space-y-2">
        <p className="label-mono text-brand">{t("label")}</p>
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>

      <Suspense
        fallback={<div className="label-mono text-muted-foreground">{t("loadingFallback")}</div>}
      >
        <SearchClient
          initialQuery={q}
          initialCategory={category}
          initialTag={tag}
          initialSince={since}
        />
      </Suspense>
    </div>
  );
}
