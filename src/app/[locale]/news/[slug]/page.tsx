import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getNewsBySlug, getRelated, getAllNews } from "@/lib/mock-data";
import { ArticleContent } from "@/components/news/article-content";
import { AuthorCard } from "@/components/news/author-card";
import { CategoryBadge } from "@/components/news/category-badge";
import { TableOfContents } from "@/components/news/table-of-contents";
import { ShareBar } from "@/components/news/share-bar";
import { RelatedArticles } from "@/components/news/related-articles";
import { formatDate } from "@/lib/format";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = getAllNews();
  const locales = ["es", "en"];
  return locales.flatMap((locale) => articles.map((a) => ({ locale, slug: a.slug })));
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://synthnode.dev";

function localePath(locale: string, path: string): string {
  return `${BASE_URL}${locale === "es" ? "" : `/${locale}`}${path}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return {};
  const path = `/news/${slug}`;
  return {
    title: `${article.title} — SYNTHNODE`,
    description: article.excerpt,
    alternates: {
      canonical: localePath(locale, path),
      languages: {
        es: localePath("es", path),
        en: localePath("en", path),
        "x-default": localePath("es", path),
      },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: `${BASE_URL}${article.image}`,
          width: 1600,
          height: 896,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [`${BASE_URL}${article.image}`],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const t = await getTranslations("article");
  const related = getRelated(article, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: `${BASE_URL}${article.image}`,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "SYNTHNODE",
      url: BASE_URL,
    },
    mainEntityOfPage: localePath(locale, `/news/${slug}`),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
        <article>
          {/* Header */}
          <header className="space-y-4 mb-10">
            <div className="flex items-center gap-3">
              <CategoryBadge slug={article.category} />
              <span className="label-mono text-muted-foreground">·</span>
              <span className="label-mono text-muted-foreground">
                {article.readingMinutes} {t("labels.minRead")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-balance">
              {article.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <div
                  className="size-7 rounded-full border border-border"
                  style={{ background: article.author.avatarColor }}
                />
                <span className="font-medium text-foreground">{article.author.name}</span>
              </div>
              <span>·</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              <span>·</span>
              <span className="font-mono">
                {article.views.toLocaleString()} {t("labels.views")}
              </span>
            </div>
          </header>

          {/* Body */}
          <ArticleContent markdown={article.content} />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <p className="label-mono text-muted-foreground mb-3">{t("labels.tags")}</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-mono border border-border rounded text-muted-foreground"
                  >
                    #{tag.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ShareBar title={article.title} />
          <AuthorCard author={article.author} />
          <RelatedArticles articles={related} />
        </article>

        {/* Sidebar — TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <TableOfContents markdown={article.content} />
          </div>
        </aside>
      </div>
    </div>
  );
}
