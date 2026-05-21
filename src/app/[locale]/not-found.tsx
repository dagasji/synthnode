import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("common.errors");
  const tActions = await getTranslations("common.actions");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-mono text-brand mb-4">// 404 / NOT_FOUND</p>
        <h1 className="text-4xl font-bold tracking-tight">{t("notFound")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t("notFoundDescription")}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          {tActions("backToHome")}
        </Link>
      </div>
    </div>
  );
}
