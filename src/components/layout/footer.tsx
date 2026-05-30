import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("common");

  return (
    <footer className="border-t border-border mt-24 py-14 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="space-y-3 max-w-xs">
          <span className="text-lg font-bold tracking-tighter">
            SYNTH<span className="text-brand">NODE</span>
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.tagline")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="label-mono text-foreground mb-3">{t("footer.sectionsLabel")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/category/ai" className="hover:text-foreground">
                  {t("navigation.categories.ai")}
                </Link>
              </li>
              <li>
                <Link href="/category/devops" className="hover:text-foreground">
                  {t("navigation.categories.devops")}
                </Link>
              </li>
              <li>
                <Link href="/category/security" className="hover:text-foreground">
                  {t("navigation.categories.security")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="label-mono text-foreground mb-3">{t("footer.platformLabel")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-foreground">
                  {t("navigation.search")}
                </Link>
              </li>
              <li>
                <a className="hover:text-foreground" href="#">
                  {t("footer.newsletterLink")}
                </a>
              </li>
              <li>
                <a className="hover:text-foreground" href="#">
                  {t("footer.rssLink")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="label-mono text-foreground mb-3">{t("footer.connectLabel")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a className="hover:text-foreground" href="#">
                  {t("footer.twitterLink")}
                </a>
              </li>
              <li>
                <a className="hover:text-foreground" href="#">
                  {t("footer.githubLink")}
                </a>
              </li>
              <li>
                <a className="hover:text-foreground" href="#">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="label-mono text-foreground mb-3">{t("footer.legalLabel")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal" className="hover:text-foreground">
                  {t("footer.legal")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground">
                  {t("footer.cookies")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-2">
        <span className="text-xs font-mono text-muted-foreground">{t("footer.copyright")}</span>
        <span className="text-xs font-mono text-muted-foreground">
          SYS · OPERATIONAL ·{" "}
          <a
            href="https://binarycore.es"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            BinaryCore
          </a>
        </span>
      </div>
    </footer>
  );
}
