import { atom, useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useActivatedDataset } from 'web/hooks/useActivatedDataset'
import { useActivatedView } from 'web/hooks/useActivatedView'

import type { SheetField } from '../field/Field'

const fieldsAtom = atom<SheetField[]>([])

export const useFields = () => {
  const { t } = useTranslation()
  const [view] = useActivatedView()
  const [dataset] = useActivatedDataset()
  const [defaultFields, instantUpdate] = useAtom(fieldsAtom)

  const fields = useMemo(
    () => {
      if (!dataset || !view) return []

      return view.fields.map<SheetField>(name => {
        const fieldInDataset = dataset.field[name]
        const fieldInView = view.field[name]

        if (!fieldInDataset || !fieldInView) throw new Error(`Field ${name} not found in dataset or view.`)

        return {
          // field
          name,
          ...fieldInDataset,
          ...fieldInView,
          // grid column
          id: name,
          title: fieldInDataset.title || t(`field.type.${fieldInDataset.type}`),
          icon: fieldInDataset.type,
          hasMenu: true,
          width: fieldInView?.width
        }
      })
    },
    [dataset, view]
  )
  const selectedFields = useMemo(() => fields.filter(field => field.selected), [fields])

  useEffect(() => {
    instantUpdate(fields ?? [])
  }, [defaultFields])

  return {
    fields,
    selectedFields,
    instantUpdate
  }
}
