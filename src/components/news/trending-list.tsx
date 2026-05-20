import Link from "next/link";
import type { NewsArticle } from "@/lib/types";
import { formatViews } from "@/lib/format";

export function TrendingList({ items }: { items: NewsArticle[] }) {
  return (
    <div>
      <h3 className="label-mono text-muted-foreground mb-5">// TRENDING_NOW</h3>
      <ol className="space-y-6">
        {items.map((a, i) => (
          <li key={a.slug} className="flex gap-4 group">
            <span className="font-mono text-xs text-brand mt-0.5 w-5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Link href={`/news/${a.slug}`} className="flex-1">
              <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-brand transition-colors text-pretty">
                {a.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {formatViews(a.views)} reads
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
