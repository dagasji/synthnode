"use client";

import { Link2, Twitter, Linkedin, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function ShareBar({ title }: { title: string }) {
  const t = useTranslations("article.share");
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  // Resolved only on the client to avoid SSR/hydration mismatch
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="pt-6 mt-6 border-t border-border">
      <h5 className="label-mono text-muted-foreground mb-3">{t("label")}</h5>
      <div className="flex gap-2">
        <a
          href={tw}
          target="_blank"
          rel="noreferrer"
          className="size-9 inline-flex items-center justify-center rounded-md border border-border hover:border-brand hover:text-brand transition-colors"
          aria-label={t("twitter")}
        >
          <Twitter className="size-4" />
        </a>
        <a
          href={li}
          target="_blank"
          rel="noreferrer"
          className="size-9 inline-flex items-center justify-center rounded-md border border-border hover:border-brand hover:text-brand transition-colors"
          aria-label={t("linkedin")}
        >
          <Linkedin className="size-4" />
        </a>
        <button
          type="button"
          onClick={copy}
          className="size-9 inline-flex items-center justify-center rounded-md border border-border hover:border-brand hover:text-brand transition-colors"
          aria-label={t("copyLink")}
        >
          {copied ? <Check className="size-4 text-brand" /> : <Link2 className="size-4" />}
        </button>
      </div>
    </div>
  );
}
