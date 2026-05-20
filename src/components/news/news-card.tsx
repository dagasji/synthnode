"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { NewsArticle } from "@/lib/types";
import { CategoryBadge } from "./category-badge";
import { formatDate } from "@/lib/format";

interface Props {
  article: NewsArticle;
  size?: "sm" | "md";
  index?: number;
}

export function NewsCard({ article, size = "md", index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col gap-4"
    >
      <Link
        href={`/news/${article.slug}`}
        className="block overflow-hidden rounded-md outline outline-1 -outline-offset-1 outline-border bg-surface"
      >
        <div className="aspect-[16/9] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            width={800}
            height={450}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <CategoryBadge slug={article.category} />
          <span className="label-mono text-muted-foreground">·</span>
          <span className="label-mono text-muted-foreground">{article.readingMinutes} min</span>
        </div>
        <Link href={`/news/${article.slug}`}>
          <h3
            className={`font-bold tracking-tight leading-snug text-foreground group-hover:text-brand transition-colors text-pretty ${
              size === "sm" ? "text-lg" : "text-xl"
            }`}
          >
            {article.title}
          </h3>
        </Link>
        {size === "md" && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 pt-1">
          <div
            className="size-6 rounded-full border border-border"
            style={{ background: article.author.avatarColor }}
          />
          <span className="text-xs text-muted-foreground">
            {article.author.name} · {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
