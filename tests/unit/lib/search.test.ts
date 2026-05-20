import { describe, it, expect } from "vitest";
import { searchNews } from "@/lib/search";

describe("searchNews", () => {
  it("returns all articles when query is empty and no filters", () => {
    const results = searchNews("");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns relevant results for a keyword query", () => {
    const results = searchNews("rust");
    expect(results.length).toBeGreaterThan(0);
    // At least one result should contain 'rust' in title or tags (case-insensitive)
    const match = results.some(
      (a) =>
        a.title.toLowerCase().includes("rust") ||
        a.tags.some((t) => t.toLowerCase().includes("rust")),
    );
    expect(match).toBe(true);
  });

  it("filters by category when category filter is provided", () => {
    const results = searchNews("", { category: "ai" });
    results.forEach((a) => expect(a.category).toBe("ai"));
  });

  it("filters by tag when tag filter is provided", () => {
    const results = searchNews("", { tag: "Rust" });
    results.forEach((a) => expect(a.tags).toContain("Rust"));
  });

  it("filters by date range when sinceDays is provided", () => {
    // Articles published in the last 30 days from mock data (2026-05)
    const results = searchNews("", { sinceDays: 30 });
    // All results should be within the last 30 days
    const cutoff = Date.now() - 30 * 86400_000;
    results.forEach((a) => {
      expect(new Date(a.publishedAt).getTime()).toBeGreaterThanOrEqual(cutoff);
    });
  });

  it("returns empty array for a nonsense query", () => {
    const results = searchNews("xyzxyzxyzimpossiblematch123456");
    expect(results).toHaveLength(0);
  });

  it("combining query + category filter narrows results", () => {
    const all = searchNews("", { category: "security" });
    const filtered = searchNews("zero-day", { category: "security" });
    expect(filtered.length).toBeLessThanOrEqual(all.length);
  });
});
