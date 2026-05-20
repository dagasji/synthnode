"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const m2 = /^##\s+(.+)/.exec(line);
    const m3 = /^###\s+(.+)/.exec(line);
    if (m2) items.push({ id: slugify(m2[1]), text: m2[1], level: 2 });
    else if (m3) items.push({ id: slugify(m3[1]), text: m3[1], level: 3 });
  }
  return items;
}

export function TableOfContents({ markdown }: { markdown: string }) {
  const items = buildToc(markdown);
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav>
      <h5 className="label-mono text-brand mb-3">EN ESTE ARTÍCULO</h5>
      <ul className="space-y-2 text-sm border-l border-border">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${it.id}`}
              className={`block -ml-px pl-3 border-l-2 transition-colors ${
                active === it.id
                  ? "border-brand text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
