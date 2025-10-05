import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/translation.json";
import fr from "./locales/fr/translation.json";

export const defaultNS = "translation";
export const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
} as const;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "fr",
    ns: ["translation"],
    defaultNS,
    resources,
    fallbackLng: "fr",
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    // TypeScript-friendly options
    returnNull: true,
    returnObjects: false,
  });

export default i18n;
