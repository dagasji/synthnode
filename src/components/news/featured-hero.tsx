"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { NewsArticle } from "@/lib/types";
import { CategoryBadge } from "./category-badge";
import { formatDate } from "@/lib/format";

export function FeaturedHero({ article }: { article: NewsArticle }) {
  const locale = useLocale();
  const t = useTranslations("article.labels");
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      <Link href={`/news/${article.slug}`} className="block">
        <div className="aspect-[21/9] overflow-hidden rounded-md outline outline-1 -outline-offset-1 outline-border bg-surface mb-6">
          <Image
            src={article.image}
            alt={article.title}
            width={1600}
            height={896}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            priority
          />
        </div>
      </Link>
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-3 text-xs font-mono text-brand">
          <CategoryBadge slug={article.category} asLink={false} />
          <span className="text-muted-foreground">/</span>
          <span className="label-mono text-muted-foreground">
            {article.readingMinutes} {t("minRead")}
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="label-mono text-muted-foreground">
            {formatDate(article.publishedAt, locale)}
          </span>
        </div>
        <Link href={`/news/${article.slug}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-balance hover:text-brand transition-colors">
            {article.title}
          </h1>
        </Link>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{article.excerpt}</p>
        <div className="flex items-center gap-3 pt-2">
          <div
            className="size-8 rounded-full border border-border"
            style={{ background: article.author.avatarColor }}
          />
          <div>
            <p className="text-sm font-semibold">{article.author.name}</p>
            <p className="text-xs text-muted-foreground">{article.author.role}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
