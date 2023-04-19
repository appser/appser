import { useMemo } from 'react'

import { useFields } from '../fields'

import type { FieldConfig } from '../fields'

export function useHeaderIcons() {
  const fields = useFields()
  const headerIcons = useMemo(
    () => Object.entries(fields).reduce<Record<string, FieldConfig['icon']>>((acc, [name, field]) => {
      acc[name] = field.icon

      return acc
    }, {})
    , [fields]
  )

  return {
    props: {
      headerIcons
    }
  }
}
