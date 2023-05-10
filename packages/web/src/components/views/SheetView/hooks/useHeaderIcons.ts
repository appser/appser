import { useMemo } from 'react'

import { useFieldsConfig } from '../fields'

import type { FieldConfig } from '../fields'

export function useHeaderIcons() {
  const fields = useFieldsConfig()
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
