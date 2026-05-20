import Fuse from "fuse.js";
import { news } from "./mock-data";
import type { NewsArticle, CategorySlug } from "./types";

const fuse = new Fuse(news, {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "excerpt", weight: 0.25 },
    { name: "tags", weight: 0.15 },
    { name: "category", weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
});

export interface SearchFilters {
  category?: CategorySlug | "all";
  tag?: string;
  sinceDays?: number;
}

export function searchNews(query: string, filters: SearchFilters = {}): NewsArticle[] {
  let results: NewsArticle[] = query.trim()
    ? fuse.search(query.trim()).map((r) => r.item)
    : [...news];

  if (filters.category && filters.category !== "all") {
    results = results.filter((n) => n.category === filters.category);
  }
  if (filters.tag) {
    results = results.filter((n) => n.tags.includes(filters.tag!));
  }
  if (filters.sinceDays) {
    const cutoff = Date.now() - filters.sinceDays * 86400_000;
    results = results.filter((n) => new Date(n.publishedAt).getTime() >= cutoff);
  }
  return results;
}
