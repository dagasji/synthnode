"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { searchNews } from "@/lib/search";
import { categories, getAllTags } from "@/lib/mock-data";
import { NewsCard } from "@/components/news/news-card";
import type { CategorySlug } from "@/lib/types";

export function SearchClient({
  initialQuery = "",
  initialCategory = "all",
  initialTag = "",
  initialSince = "all",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const t = useTranslations("search");

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategorySlug | "all">(
    initialCategory as CategorySlug | "all",
  );
  const [tag, setTag] = useState(initialTag);
  const [since, setSince] = useState(initialSince);

  const sinceDaysMap: Record<string, number | undefined> = {
    "24h": 1,
    "7d": 7,
    "30d": 30,
    all: undefined,
  };

  const results = searchNews(query, {
    category: category !== "all" ? (category as CategorySlug) : "all",
    tag: tag || undefined,
    sinceDays: sinceDaysMap[since],
  });

  const tags = getAllTags().slice(0, 15);

  function updateUrl(q: string, cat: string, tg: string, sn: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    if (cat && cat !== "all") params.set("category", cat);
    else params.delete("category");
    if (tg) params.set("tag", tg);
    else params.delete("tag");
    if (sn && sn !== "all") params.set("since", sn);
    else params.delete("since");
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="space-y-8">
      {/* Search input */}
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          updateUrl(e.target.value, category, tag, since);
        }}
        placeholder={t("placeholder")}
        className="w-full bg-background border border-border px-4 py-3 text-base rounded-md focus:outline-none focus:border-brand transition-colors font-mono"
      />

      {/* Since filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-mono text-muted-foreground">{t("filters.since")}:</label>
        <select
          value={since}
          onChange={(e) => {
            setSince(e.target.value);
            updateUrl(query, category, tag, e.target.value);
          }}
          className="bg-background border border-border px-2 py-1 text-xs font-mono rounded focus:outline-none focus:border-brand"
        >
          <option value="all">{t("filters.sinceAll")}</option>
          <option value="24h">{t("filters.since24h")}</option>
          <option value="7d">{t("filters.since7d")}</option>
          <option value="30d">{t("filters.since30d")}</option>
        </select>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setCategory("all");
            updateUrl(query, "all", tag, since);
          }}
          className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${category === "all" ? "border-brand text-brand" : "border-border text-muted-foreground hover:border-brand hover:text-brand"}`}
        >
          {t("filters.allCategories")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => {
              setCategory(cat.slug as CategorySlug);
              updateUrl(query, cat.slug, tag, since);
            }}
            className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${category === cat.slug ? "border-brand text-brand" : "border-border text-muted-foreground hover:border-brand hover:text-brand"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag: tg }) => (
          <button
            key={tg}
            type="button"
            onClick={() => {
              const next = tag === tg ? "" : tg;
              setTag(next);
              updateUrl(query, category, next, since);
            }}
            className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ${tag === tg ? "border-brand text-brand" : "border-border text-muted-foreground hover:border-brand hover:text-brand"}`}
          >
            #{tg.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="label-mono text-muted-foreground">
        {results.length} {results.length === 1 ? t("resultsOne") : t("resultsMany")}
      </p>

      {/* Results grid */}
      {results.length === 0 ? (
        <p className="text-muted-foreground">{t("results.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((article, i) => (
            <NewsCard key={article.slug} article={article} size="sm" index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
