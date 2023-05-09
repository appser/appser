import { datasetIconIds, datasetTintColors } from '@appser/common'
import { ActionIcon, Box, ColorSwatch, Divider, Group } from '@appser/ui'
import { useForm } from '@appser/ui'
import { useEffect } from 'react'

import { IconApp } from '../icons/IconApp'

import type { MouseEvent } from 'react'

interface Style {
  tintColor: string
  icon: string
}

interface AppStylePanelProps {
  defaultStyle: Style
  onChange?: (style: Style) => void
}

export function AppStylePanel({ defaultStyle, onChange }: AppStylePanelProps) {
  const style = useForm({
    initialValues: defaultStyle
  })

  useEffect(() => {
    style.isDirty() && onChange?.(style.values)
  }, [style.values])

  return (
    <Box onDoubleClick={(e: MouseEvent) => e.stopPropagation()}>
      <Group p="sm">
        {datasetTintColors.map(color => (
          <ColorSwatch sx={theme => ({
            ...theme.fn.hover({
              transform: 'scale(1.2)'
            })
          })}
            onClick={() => style.setValues({ tintColor: color })}
            key={color}
            color={color}
          />
        ))}
      </Group>
      <Divider />
      <Group p="sm">
        {datasetIconIds.map(id => (
          <ActionIcon key={id} onClick={() => style.setValues({ icon: id })}>
            <IconApp id={id} />
          </ActionIcon>
        ))}
      </Group>
    </Box>
  )
}
