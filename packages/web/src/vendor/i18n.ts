import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

const loadBundle = (locale: string, ns: string) =>
  import(`../../node_modules/@appser/languages/${locale}/${ns}.json`).then(res => res.default)

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // lng: DEFAULT_LANGUAGE, // if you're using a language detector, do not define the lng option
    supportedLngs: ['en', 'zh-CN'],
    fallbackLng: 'en',
    ns: ['web', 'error'],
    defaultNS: 'web',
    // debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    backend: {
      loadPath: '{{lng}}|{{ns}}',
      request: (options: unknown, url: string, payload: unknown, callback: any) => {
        try {
          const [lng, ns] = url.split('|')

          loadBundle(lng, ns).then(data => {
            callback(null, {
              data: JSON.stringify(data),
              status: 200 // status code is required by XHR plugin to determine success or failure
            })
          })
        }
        catch (e) {
          console.error(e)
          callback(null, {
            status: 500,
            data: ''
          })
        }
      }
    }
  })

export default i18n
