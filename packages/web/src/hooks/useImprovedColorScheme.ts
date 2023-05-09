import { useLocalStorage } from '@appser/ui'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { ColorScheme } from '@appser/ui'

export type ImprovedColorScheme = ColorScheme | 'system' | ''

export default function useCustomColorScheme() {
  const [colorSchemeLocalStorage, setColorSchemeLocalStorage] = useLocalStorage<ImprovedColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: '',
    getInitialValueInEffect: true
  })
  const _colorSchemeLocalStorage = useRef<ImprovedColorScheme>(colorSchemeLocalStorage)
  const mounted = useRef(false)
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
  const toggleColorScheme = useCallback((value?: ColorScheme | 'system') => setColorSchemeLocalStorage(value || (colorScheme === 'dark' ? 'light' : 'dark')), [setColorSchemeLocalStorage])

  useEffect(() => () => {
    mounted.current = false
  }, [])
  useEffect(() => {
    _colorSchemeLocalStorage.current = colorSchemeLocalStorage

    const matchesHandler = (e: MediaQueryListEvent) => {
      if (_colorSchemeLocalStorage.current === 'system') setColorScheme(e.matches ? 'light' : 'dark')
    }

    const themeMedia = window.matchMedia('(prefers-color-scheme: light)')
    themeMedia.addEventListener('change', matchesHandler)

    if (colorSchemeLocalStorage) {
      if (colorSchemeLocalStorage !== 'system') {
        setColorScheme(colorSchemeLocalStorage || (colorScheme === 'dark' ? 'light' : 'dark'))
      } else {
        if (mounted.current) {
          setColorScheme(themeMedia.matches ? 'light' : 'dark')
        }
      }
    }

    mounted.current = true

    return themeMedia.addEventListener('change', matchesHandler)
  }, [colorSchemeLocalStorage])

  return {
    colorScheme,
    colorSchemeLocalStorage,
    toggleColorScheme
  }
}
