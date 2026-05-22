"use client";

import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Introduce un email válido" })
  .max(320, { message: "Email demasiado largo" });

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const t = useTranslations("newsletter");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Email inválido");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "c7a53dbf-abf4-4dc7-9497-e93e281ddc86",
          email: parsed.data.toLowerCase(),
          subject: "Nuevo newsletter signup - SYNTHNODE",
          message: `Email registrado para newsletter: ${parsed.data.toLowerCase()}`,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Error al enviar el correo");
      }

      setDone(true);
      toast.success(t("success"));
    } catch (error) {
      console.error("Error al enviar correo:", error);
      toast.error("No pudimos registrarte. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

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
        <form className="space-y-2" onSubmit={onSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            maxLength={320}
            disabled={loading}
            className="w-full bg-background border border-border px-3 py-2 text-sm rounded-md focus:outline-none focus:border-brand transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background font-semibold py-2 text-sm rounded-md hover:bg-brand transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </button>
        </form>
      )}
    </div>
  );
}
