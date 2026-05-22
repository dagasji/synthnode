"use client";

import Link from "next/link";
import { getCategoryBySlug } from "@/lib/mock-data";
import type { CategorySlug } from "@/lib/types";
import { useTranslations } from "next-intl";

export function CategoryBadge({ slug, asLink = true }: { slug: CategorySlug; asLink?: boolean }) {
  const t = useTranslations("common.navigation.categories");
  const cat = getCategoryBySlug(slug);
  if (!cat) return null;
  const className = "label-mono text-brand hover:text-foreground transition-colors";
  if (!asLink) return <span className={className}>{t(slug)}</span>;
  return (
    <Link href={`/category/${slug}`} className={className}>
      {t(slug)}
    </Link>
  );
}
