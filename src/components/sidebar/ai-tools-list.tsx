import { ArrowUpRight } from "lucide-react";
import { aiTools } from "@/lib/mock-data";
import { getTranslations } from "next-intl/server";

export async function AIToolsList() {
  const t = await getTranslations("sidebar.toolbench");
  return (
    <div>
      <h3 className="label-mono text-muted-foreground mb-4">// {t("title")}</h3>
      <div className="space-y-1">
        {aiTools.map((t) => (
          <a
            key={t.name}
            href="#"
            className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface transition-colors group"
          >
            <div>
              <p className="text-sm font-bold flex items-center gap-2">
                {t.name}
                {t.badge && (
                  <span className="label-mono text-brand bg-brand/10 px-1.5 py-0.5 rounded">
                    {t.badge}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
}
