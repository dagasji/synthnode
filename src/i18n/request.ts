import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import esMessages from "../messages/es.json";
import enMessages from "../messages/en.json";
import ptBRMessages from "../messages/pt-BR.json";
import jaMessages from "../messages/ja.json";
import koMessages from "../messages/ko.json";

const messagesMap: Record<string, AbstractIntlMessages> = {
  es: esMessages as AbstractIntlMessages,
  en: enMessages as AbstractIntlMessages,
  "pt-BR": ptBRMessages as AbstractIntlMessages,
  ja: jaMessages as AbstractIntlMessages,
  ko: koMessages as AbstractIntlMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? "es";
  return {
    locale,
    messages: messagesMap[locale] || messagesMap.es,
  };
});
