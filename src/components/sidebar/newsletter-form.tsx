"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const t = useTranslations("newsletter");
  return (
    <div className="p-6 bg-surface border border-border rounded-md space-y-4">
      <div>
        <h3 className="text-lg font-bold">{t("title")}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>
      {done ? (
        <div className="flex items-center gap-2 text-sm text-brand">
          <CheckCircle2 className="size-4" />
          <span>{t("success")}</span>
        </div>
      ) : (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.includes("@")) setDone(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="w-full bg-background border border-border px-3 py-2 text-sm rounded-md focus:outline-none focus:border-brand transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-foreground text-background font-semibold py-2 text-sm rounded-md hover:bg-brand transition-colors uppercase tracking-wider"
          >
            {t("submit")}
          </button>
        </form>
      )}
    </div>
  );
}
