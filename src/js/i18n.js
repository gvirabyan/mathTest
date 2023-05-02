import { createI18n } from "vue-i18n";
import de from "./locales/de.json";

const i18n = createI18n({
  locale: import.meta.env.VITE_LANGUAGE,
  messages: {
    de,
  },
});

export default i18n;
