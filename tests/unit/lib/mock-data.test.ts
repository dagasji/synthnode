import { describe, it, expect } from "vitest";
import {
  getFeatured,
  getNewsBySlug,
  getCategoryBySlug,
  getAllNews,
  getTrending,
  getRelated,
  getNewsByCategory,
} from "@/lib/mock-data";

describe("getFeatured", () => {
  it("returns an article with featured flag or falls back to first article", () => {
    const article = getFeatured();
    expect(article).toBeDefined();
    expect(typeof article.slug).toBe("string");
    expect(typeof article.title).toBe("string");
  });
});

describe("getNewsBySlug", () => {
  it("returns the correct article for a known slug", () => {
    const article = getNewsBySlug("beyond-llms-arquitecturas-cognitivas");
    expect(article).toBeDefined();
    expect(article?.slug).toBe("beyond-llms-arquitecturas-cognitivas");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getNewsBySlug("slug-que-no-existe")).toBeUndefined();
  });
});

describe("getCategoryBySlug", () => {
  it("returns the correct category for a known slug", () => {
    const cat = getCategoryBySlug("ai");
    expect(cat).toBeDefined();
    expect(cat?.slug).toBe("ai");
    expect(typeof cat?.name).toBe("string");
  });

  it("returns undefined for an unknown category", () => {
    expect(getCategoryBySlug("categoria-inventada")).toBeUndefined();
  });
});

describe("getAllNews", () => {
  it("returns articles sorted by publishedAt descending", () => {
    const articles = getAllNews();
    expect(articles.length).toBeGreaterThan(0);
    for (let i = 0; i < articles.length - 1; i++) {
      const a = new Date(articles[i].publishedAt).getTime();
      const b = new Date(articles[i + 1].publishedAt).getTime();
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });
});

describe("getTrending", () => {
  it("returns at most the requested limit", () => {
    const trending = getTrending(3);
    expect(trending.length).toBeLessThanOrEqual(3);
  });

  it("only returns articles with trending flag", () => {
    const trending = getTrending(10);
    trending.forEach((a) => expect(a.trending).toBe(true));
  });
});

describe("getRelated", () => {
  it("does not include the source article", () => {
    const source = getNewsBySlug("beyond-llms-arquitecturas-cognitivas")!;
    const related = getRelated(source, 3);
    expect(related.every((a) => a.slug !== source.slug)).toBe(true);
  });

  it("returns at most the requested limit", () => {
    const source = getFeatured();
    expect(getRelated(source, 2).length).toBeLessThanOrEqual(2);
  });
});

describe("getNewsByCategory", () => {
  it("returns only articles of the given category", () => {
    const articles = getNewsByCategory("ai");
    articles.forEach((a) => expect(a.category).toBe("ai"));
  });

  it("returns empty array for a category with no articles", () => {
    const articles = getNewsByCategory("categoria-vacia-inexistente");
    expect(articles).toHaveLength(0);
  });
});
