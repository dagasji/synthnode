import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("/search page loads with noindex meta", async ({ page }) => {
    await page.goto("/en/search");
    await expect(page).toHaveURL("/en/search");
    await expect(page.locator("h1")).toBeVisible();
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/i);
  });

  test("search input filters results by query", async ({ page }) => {
    await page.goto("/en/search?q=rust");
    const input = page.locator('input[type="search"]');
    await expect(input).toHaveValue("rust");
    await expect(page.locator("text=/resultado/")).toBeVisible();
  });

  test("category filter narrows results", async ({ page }) => {
    await page.goto("/en/search");
    await page.getByRole("button", { name: "Inteligencia Artificial" }).click();
    await expect(page.locator("text=/resultado/")).toBeVisible();
  });

  test("no results message shown for impossible query", async ({ page }) => {
    await page.goto("/en/search?q=xyzxyzxyzimpossible123");
    await expect(page.locator("text=/Sin resultados/")).toBeVisible();
  });
});
