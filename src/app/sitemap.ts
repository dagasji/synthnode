import type { MetadataRoute } from "next";
import { getAllNews, categories } from "@/lib/mock-data";

import { BASE_URL } from "@/lib/constants/site";

const LOCALES = ["es", "en"] as const;

function localePath(locale: string, path: string): string {
  return `${BASE_URL}${locale === "es" ? "" : `/${locale}`}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFreq: "daily" as const },
    { path: "/search", priority: 0.3, changeFreq: "monthly" as const },
  ];

  const categoryRoutes = categories.map((c) => ({
    path: `/category/${c.slug}`,
    priority: 0.7,
    changeFreq: "weekly" as const,
  }));

  const articleRoutes = getAllNews().map((a) => ({
    path: `/news/${a.slug}`,
    priority: 0.8,
    changeFreq: "monthly" as const,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes].flatMap((route) =>
    LOCALES.map((locale) => ({
      url: localePath(locale, route.path),
      changeFrequency: route.changeFreq,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, localePath(l, route.path)])),
      },
    })),
  );
}
