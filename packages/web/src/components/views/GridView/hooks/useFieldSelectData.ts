import { useFields } from '../fields'

import type { FieldType } from '../fields'
import type { SpriteProps } from '@glideapps/glide-data-grid/dist/ts/common/utils'

export const useFieldSelectData = () => {
  const { checkbox, date, email, multipleSelect, number, numId, simpleText, singleSelect, url } = useFields()

  const sprite: SpriteProps = {
    fgColor: '#000',
    bgColor: '#fff'
  }
  const selectData: { label: string; value: FieldType; icon: string }[] = [
    { label: 'Simple Text', value: 'simpleText', icon: simpleText.icon(sprite) },
    { label: 'Number', value: 'number', icon: number.icon(sprite) },
    { label: 'Checkbox', value: 'checkbox', icon: checkbox.icon(sprite) },
    { label: 'Date', value: 'date', icon: date.icon(sprite) },
    { label: 'Email', value: 'email', icon: email.icon(sprite) },
    { label: 'Url', value: 'url', icon: url.icon(sprite) },
    { label: 'Single Select', value: 'singleSelect', icon: singleSelect.icon(sprite) },
    { label: 'Multiple Select', value: 'multipleSelect', icon: multipleSelect.icon(sprite) }
    // { label: 'Number Id', value: 'numId' },
    // { label: 'Rich Text', value: 'richText', icon: richText.icon(sprite) },
  ]

  return selectData
}
