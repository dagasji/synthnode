import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import esMessages from "@/messages/es.json";

export function IntlWrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="es" messages={esMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
