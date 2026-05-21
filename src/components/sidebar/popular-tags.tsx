import Link from "next/link";
import { getAllTags } from "@/lib/mock-data";
import { getTranslations } from "next-intl/server";

export async function PopularTags() {
  const tags = getAllTags().slice(0, 12);
  const t = await getTranslations("sidebar.tags");
  return (
    <div>
      <h3 className="label-mono text-muted-foreground mb-4">// {t("title")}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag }) => (
          <Link
            key={tag}
            href={`/search?q=&category=all&tag=${encodeURIComponent(tag)}`}
            className="px-2.5 py-1 text-xs font-mono border border-border rounded text-muted-foreground hover:text-brand hover:border-brand transition-colors"
          >
            #{tag.toLowerCase().replace(/\s+/g, "-")}
          </Link>
        ))}
      </div>
    </div>
  );
}
