import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getFeatured, getAllNews, getTrending } from "@/lib/mock-data";
import { FeaturedHero } from "@/components/news/featured-hero";
import { NewsCard } from "@/components/news/news-card";
import { TrendingList } from "@/components/news/trending-list";
import { Sidebar } from "@/components/sidebar/sidebar";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://synthnode.dev";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  const canonical = locale === "es" ? `${BASE_URL}/` : `${BASE_URL}/${locale}`;
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        es: `${BASE_URL}/`,
        en: `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonical,
      siteName: "SYNTHNODE",
      type: "website",
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const featured = getFeatured();
  const allNews = getAllNews();
  const trending = getTrending(5);
  const rest = allNews.filter((a) => a.slug !== featured.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      <FeaturedHero article={featured} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
        <div className="space-y-16">
          <section>
            <h2 className="label-mono text-muted-foreground mb-8">// {t("latestTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {rest.slice(0, 4).map((article, i) => (
                <NewsCard key={article.slug} article={article} index={i} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="label-mono text-muted-foreground mb-8">// {t("moreTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rest.slice(4).map((article, i) => (
                <NewsCard key={article.slug} article={article} size="sm" index={i} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-10">
          <TrendingList items={trending} />
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
