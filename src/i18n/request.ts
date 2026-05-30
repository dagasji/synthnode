import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import esMessages from "../messages/es.json";
import enMessages from "../messages/en.json";
import ptBRMessages from "../messages/pt-BR.json";
import jaMessages from "../messages/ja.json";
import koMessages from "../messages/ko.json";

const messagesMap: Record<string, AbstractIntlMessages> = {
  es: esMessages as unknown as AbstractIntlMessages,
  en: enMessages as unknown as AbstractIntlMessages,
  "pt-BR": ptBRMessages as unknown as AbstractIntlMessages,
  ja: jaMessages as unknown as AbstractIntlMessages,
  ko: koMessages as unknown as AbstractIntlMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? "es";
  return {
    locale,
    messages: messagesMap[locale] || messagesMap.es,
  };
});
