"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

const NAV_ITEMS = [
  { labelKey: "ai", href: "/category/ai" },
  { labelKey: "programming", href: "/category/programming" },
  { labelKey: "devops", href: "/category/devops" },
  { labelKey: "startups", href: "/category/startups" },
  { labelKey: "open-source", href: "/category/open-source" },
] as const;

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}&category=all&tag=`);
  };

  return (
    <header role="banner" className="sticky top-0 z-50 frosted border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <Image src="/icon.png" alt="SYNTHNODE" width={32} height={32} />
            SYNTH<span className="text-brand">NODE</span>
          </Link>
          <nav
            role="navigation"
            aria-label={t("navigation.home")}
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground"
          >
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`hover:text-foreground transition-colors ${pathname === it.href ? "text-foreground" : ""}`}
              >
                {t(`navigation.categories.${it.labelKey}`)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={onSubmit} className="hidden md:flex items-center relative">
            <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("actions.searchPlaceholder")}
              aria-label={t("actions.searchPlaceholder")}
              className="bg-surface border border-border rounded-md py-1.5 pl-9 pr-3 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </form>
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            className="lg:hidden size-9 inline-flex items-center justify-center rounded-md border border-border"
            aria-label={mobileOpen ? t("navigation.closeMenu") : t("navigation.openMenu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-2">
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium hover:text-brand"
              >
                {t(`navigation.categories.${it.labelKey}`)}
              </Link>
            ))}
            <form onSubmit={onSubmit} className="mt-2 relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("actions.searchPlaceholder")}
                className="w-full bg-surface border border-border rounded-md py-2 pl-9 pr-3 text-sm"
              />
            </form>
          </nav>
        </div>
      )}
    </header>
  );
}
