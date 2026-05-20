import Link from "next/link";
import { getCategoryBySlug } from "@/lib/mock-data";
import type { CategorySlug } from "@/lib/types";

export function CategoryBadge({ slug, asLink = true }: { slug: CategorySlug; asLink?: boolean }) {
  const cat = getCategoryBySlug(slug);
  if (!cat) return null;
  const className = "label-mono text-brand hover:text-foreground transition-colors";
  if (!asLink) return <span className={className}>{cat.name}</span>;
  return (
    <Link href={`/category/${slug}`} className={className}>
      {cat.name}
    </Link>
  );
}
