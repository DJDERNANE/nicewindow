import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import languages files
import french_lines from "./translations/fr/index.json";
import arabic_lines from "./translations/ar/index.json";
import english_lines from "./translations/en/index.json";

i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    interpolation: {
        escapeValue: false,
    },
    lng: "en",
    resources: {
        fr: french_lines,
        ar: arabic_lines,
        en: english_lines,
    },
});

export default i18n;
