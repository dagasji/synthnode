import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads and shows featured article", async ({ page }) => {
    await page.goto("/");
    // Middleware may redirect to /en — accept both root and /en
    await expect(page).toHaveURL(/localhost:3000\/(en\/?)?$/);
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await expect(h1).not.toBeEmpty();
  });

  test("/en home loads with hreflang tags", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveURL("/en");
    // x-default + es + en = 3
    const hreflang = page.locator('link[rel="alternate"][hreflang]');
    await expect(hreflang).toHaveCount(3);
  });

  test("clicking an article navigates to /news/[slug]", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveURL("/en");
    const articleLink = page.locator('article a[href*="/news/"]').first();
    await articleLink.click();
    await expect(page).toHaveURL(/\/news\//);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("clicking a category badge navigates to /category/[slug]", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveURL("/en");
    const categoryLink = page.locator('a[href*="/category/"]').first();
    await categoryLink.click();
    await expect(page).toHaveURL(/\/category\//);
  });

  test("404 for unknown route", async ({ page }) => {
    const response = await page.goto("/ruta-que-no-existe-en-absoluto");
    expect(response?.status()).toBe(404);
  });
});
