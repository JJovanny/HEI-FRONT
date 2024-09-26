// import Languages from 'react-languages';
import I18n from 'i18n-js'
import moment from 'moment'
// @ts-ignore
import detectBrowserLanguage from 'detect-browser-language'

import en from './en'
import es from './es'
import pt from './pt'
import 'moment/min/locales'

/* export const addTranslation = async (key, ns = 'translation', value) => {
  I18n.translations[key] = value
} */

export const addTranslation = (code, newTranslation) => {
  I18n.translations[code] = {
    ...I18n.translations[code],
    ...newTranslation
  }

  I18n.extend(I18n.translations)
  I18n.fallbacks = true
}
// Enable fallback if you want `en-US` and `en-GB` to fallback to `en`
// I18n.fallbacks = true;

// Available languages
I18n.translations = {
  en,
  es,
  pt // Añadido soporte para portugués
}

const getLocale = () => {
  if (typeof window !== 'undefined') {
    const language: string = detectBrowserLanguage().substring(0, 2)
    if (language.includes('es') || language.includes('en') || language.includes('pt')) {
      return detectBrowserLanguage().replace('-', '_')
    }
  }

  return 'en'
}

const setLocale = (locale) => {
  I18n.locale = locale;
  moment.locale(locale);
};

// Default locale
I18n.locale = getLocale().substring(0, 2)

const initTranslations = () => {
  const locale = getLocale()

  if (locale) moment.locale(locale.substring(0, 2) || 'en')

  return I18n.translations
}

/**
 * The method we'll use instead of a regular string
 * @param name
 * @param params
 */
const strings = (name, params = {}) => I18n.t(name, params)

export { I18n, getLocale, initTranslations, strings, setLocale }
