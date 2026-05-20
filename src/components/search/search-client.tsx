"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchNews } from "@/lib/search";
import { categories, getAllTags } from "@/lib/mock-data";
import { NewsCard } from "@/components/news/news-card";
import type { CategorySlug } from "@/lib/types";

export function SearchClient({ initialQuery = "", initialCategory = "all", initialTag = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategorySlug | "all">(
    initialCategory as CategorySlug | "all",
  );
  const [tag, setTag] = useState(initialTag);

  const results = searchNews(query, {
    category: category !== "all" ? (category as CategorySlug) : "all",
    tag: tag || undefined,
  });

  const tags = getAllTags().slice(0, 15);

  function updateUrl(q: string, cat: string, t: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    if (cat && cat !== "all") params.set("category", cat);
    else params.delete("category");
    if (t) params.set("tag", t);
    else params.delete("tag");
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
          updateUrl(e.target.value, category, tag);
        }}
        placeholder="Buscar noticias, tags, autores…"
        className="w-full bg-background border border-border px-4 py-3 text-base rounded-md focus:outline-none focus:border-brand transition-colors font-mono"
      />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setCategory("all");
            updateUrl(query, "all", tag);
          }}
          className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${category === "all" ? "border-brand text-brand" : "border-border text-muted-foreground hover:border-brand hover:text-brand"}`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => {
              setCategory(cat.slug as CategorySlug);
              updateUrl(query, cat.slug, tag);
            }}
            className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${category === cat.slug ? "border-brand text-brand" : "border-border text-muted-foreground hover:border-brand hover:text-brand"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag: t }) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              const next = tag === t ? "" : t;
              setTag(next);
              updateUrl(query, category, next);
            }}
            className={`px-2 py-0.5 text-xs font-mono rounded border transition-colors ${tag === t ? "border-brand text-brand" : "border-border text-muted-foreground hover:border-brand hover:text-brand"}`}
          >
            #{t.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="label-mono text-muted-foreground">
        {results.length} {results.length === 1 ? "resultado" : "resultados"}
      </p>

      {/* Results grid */}
      {results.length === 0 ? (
        <p className="text-muted-foreground">
          Sin resultados. Prueba a quitar filtros o cambiar la búsqueda.
        </p>
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
