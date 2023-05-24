// TODO: Implement this hook to return the locale of the user

import { atom, useAtom } from 'jotai'

const locale = atom({
  /** eg. zh-CN, en-US */
  language: navigator.language,
  calendar: 'gregory',
  firstDayOfWeek: 1
})

export const useLocale = () => useAtom(locale)
