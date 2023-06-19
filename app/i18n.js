import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "../i18n/messages";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "fr",
    lng: process.env.NEXT_PUBLIC_LANG,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
