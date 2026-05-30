import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import CookieBanner from "@/components/cookies/CookieBanner";
import CookieSettingsButton from "@/components/cookies/CookieSettingsButton";

import { BASE_URL } from "@/lib/constants/site";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SYNTHNODE",
    template: "%s",
  },
  icons: {
    icon: "/icon.png",
  },
  openGraph: { siteName: "SYNTHNODE", type: "website" },
  twitter: { card: "summary_large_image" },
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SYNTHNODE",
    description:
      "Noticias e investigación sobre IA, programación, DevOps, ciberseguridad y startups técnicas.",
    url: BASE_URL,
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <CookieSettingsButton />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
