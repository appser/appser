import { Box, Checkbox, Group, MultiSelect, Text, createStyles } from '@mantine/core'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { FieldColumnInputProps } from '..'
import type { FC } from 'react'

const useStyles = createStyles(theme => ({
  tag: {
    height: 22,
    padding: `0 ${theme.spacing.md}px`,
    lineHeight: '22px',
    fontSize: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[2] : theme.colors.dark[5]
  }
}))

export const MultipleSelectColumnInput: FC<FieldColumnInputProps> = ({ column, onChange, data, denyEdit }) => {
  const [totalWidth, setTotalWidth] = useState(0)
  const { classes } = useStyles()
  const ref = useRef<HTMLDivElement | null>(null)
  const selectData = useMemo(
    () => {
      if (column.field !== 'multipleSelect') return []

      return column.options.items.map(({ id, name }, i) => ({
        value: id ?? String(i),
        label: name
      }))
    }
    , [column]
  )

  useLayoutEffect(() => setTotalWidth(ref?.current?.clientWidth ?? 0), [])

  if (selectData.length < 4) {
    return (
      <Checkbox.Group
        spacing={15}
        offset={0}
        orientation={totalWidth > 230 ? 'vertical' : 'horizontal'}
        ref={ref}
        display='inline-flex'
      >
        {selectData.map(s => (
          <Checkbox disabled={denyEdit} value={s.value} key={s.value} label={s.label} />
        ))}
      </Checkbox.Group>
    )
  }

  return (
    denyEdit
      ? <Group>
        {[1, 2, 4, 5, 6, 7, 8, 9, 10, 11].map(d => (
          <Text key={d} className={classes.tag}>{d}</Text>
        ))}
      </Group>
      : <MultiSelect
          data={selectData}
          variant='filled'
          placeholder="Pick all that you like"
          searchable
          dropdownPosition='flip'
          onChange={onChange}
          nothingFound="Nothing found"
        />
  )
}
