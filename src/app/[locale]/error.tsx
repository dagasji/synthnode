"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("common.errors");
  const tActions = useTranslations("common.actions");

  useEffect(() => {
    // Log to error monitoring service in production
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center text-center gap-8">
      <p className="label-mono text-brand">// ERROR</p>
      <h1 className="text-4xl font-bold tracking-tight">{t("generic")}</h1>
      <p className="text-muted-foreground max-w-md">{t("genericDescription")}</p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 bg-foreground text-background text-sm font-semibold rounded-md hover:bg-brand transition-colors"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-border text-sm font-semibold rounded-md hover:border-brand hover:text-brand transition-colors"
        >
          {tActions("backToHome")}
        </Link>
      </div>
    </div>
  );
}
