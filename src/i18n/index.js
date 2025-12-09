import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './locales/en.json';
import ja from './locales/ja.json';

const resources = {
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
};

const languageDetector = {
  type: 'languageDetector',
  async: false,
  detect: (callback) => {
    const bestLanguage = RNLocalize.findBestLanguageTag(Object.keys(resources));
    return bestLanguage?.languageTag || 'en';
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3', // For Android
  });

export default i18n;
