import type { NewsArticle } from "@/lib/types";
import { NewsCard } from "./news-card";

export function RelatedArticles({ articles }: { articles: NewsArticle[] }) {
  if (!articles.length) return null;
  return (
    <section className="mt-20 pt-12 border-t border-border">
      <h2 className="label-mono text-muted-foreground mb-8">// RELACIONADOS</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((a, i) => (
          <NewsCard key={a.slug} article={a} size="sm" index={i} />
        ))}
      </div>
    </section>
  );
}
