import { Switch } from '@mantine/core'

import { FormSectionItem } from './FormSectionItem'

import type { SwitchProps } from '@mantine/core'
import type { FC } from 'react'

export const FormSectionSwitch: FC<SwitchProps> = ({ label, description, ...props }) => {
  return (
    <FormSectionItem label={label} description={description}>
      <Switch styles={{ root: { display: 'flex', alignItems: 'center' } }} {...props} />
    </FormSectionItem>
  )
}
