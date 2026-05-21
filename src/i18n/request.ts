import { getRequestConfig } from "next-intl/server";
import esMessages from "../messages/es.json";
import enMessages from "../messages/en.json";
import ptBRMessages from "../messages/pt-BR.json";
import jaMessages from "../messages/ja.json";
import koMessages from "../messages/ko.json";

const messagesMap: Record<string, any> = {
  es: esMessages,
  en: enMessages,
  "pt-BR": ptBRMessages,
  ja: jaMessages,
  ko: koMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? "es";
  return {
    locale,
    messages: messagesMap[locale] || messagesMap.es,
  };
});
