import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getNewsByCategory, getCategoryBySlug, categories } from "@/lib/mock-data";
import { NewsCard } from "@/components/news/news-card";
import { Sidebar } from "@/components/sidebar/sidebar";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const locales = ["es", "en"];
  return locales.flatMap((locale) => categories.map((c) => ({ locale, slug: c.slug })));
}

import { BASE_URL } from "@/lib/constants/site";

function localePath(locale: string, path: string): string {
  return `${BASE_URL}${locale === "es" ? "" : `/${locale}`}${path}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  const path = `/category/${slug}`;
  return {
    title: `${cat.name} — SYNTHNODE`,
    description: cat.description,
    alternates: {
      canonical: localePath(locale, path),
      languages: {
        es: localePath("es", path),
        en: localePath("en", path),
        "x-default": localePath("es", path),
      },
    },
    openGraph: {
      title: `${cat.name} — SYNTHNODE`,
      description: cat.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const t = await getTranslations("category");
  const articles = getNewsByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <header className="space-y-2">
        <p className="label-mono text-brand">{t("label")}</p>
        <h1 className="text-4xl font-bold tracking-tight">{cat.name}</h1>
        <p className="text-muted-foreground">{cat.description}</p>
        <p className="label-mono text-muted-foreground">
          {articles.length} {articles.length === 1 ? "artículo" : "artículos"}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
        <div>
          {articles.length === 0 ? (
            <p className="text-muted-foreground">{t("noArticles")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {articles.map((article, i) => (
                <NewsCard key={article.slug} article={article} index={i} />
              ))}
            </div>
          )}
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
