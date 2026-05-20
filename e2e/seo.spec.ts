import { test, expect } from "@playwright/test";

test.describe("SEO files", () => {
  test("/robots.txt returns 200 and contains User-Agent", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toMatch(/User-Agent/i);
    expect(body).toContain("Sitemap");
  });

  test("/sitemap.xml returns 200 and contains article URLs", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain("<url>");
    expect(body).toContain("news/");
    expect(body).toContain("category/");
    const matches = body?.match(/<url>/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(20);
  });

  test("/ads.txt returns 200", async ({ page }) => {
    const response = await page.goto("/ads.txt");
    expect(response?.status()).toBe(200);
  });

  test("home page has JSON-LD WebSite schema", async ({ page }) => {
    await page.goto("/en");
    const ldJson = page.locator('script[type="application/ld+json"]').first();
    await expect(ldJson).toBeAttached();
    const content = await ldJson.textContent();
    const schema = JSON.parse(content!);
    expect(schema["@type"]).toBe("WebSite");
  });

  test("article page has JSON-LD NewsArticle schema", async ({ page }) => {
    const response = await page.goto("/en/news/beyond-llms-arquitecturas-cognitivas");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    const ldJsonScripts = page.locator('script[type="application/ld+json"]');
    const count = await ldJsonScripts.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const content = await ldJsonScripts.nth(i).textContent();
      try {
        const schema = JSON.parse(content!);
        if (schema["@type"] === "NewsArticle") {
          found = true;
          break;
        }
      } catch {
        // skip non-JSON
      }
    }
    expect(found).toBe(true);
  });

  test("article page has hreflang via Link response header or meta", async ({ page }) => {
    const response = await page.goto("/en/news/beyond-llms-arquitecturas-cognitivas");
    expect(response?.status()).toBe(200);
    // Next.js 15 emits hreflang as HTTP Link headers for SSG pages
    const linkHeader = response?.headers()["link"] ?? "";
    const hasHreflang =
      linkHeader.includes("hreflang") ||
      (await page.locator('link[rel="alternate"][hreflang]').count()) > 0;
    expect(hasHreflang).toBe(true);
  });
});
