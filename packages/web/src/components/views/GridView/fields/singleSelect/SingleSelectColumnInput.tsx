import { Box, Radio, Select, Text, createStyles } from '@mantine/core'
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

export const SingleSelectColumnInput: FC<FieldColumnInputProps> = ({ column, onChange, data, denyEdit }) => {
  const [totalWidth, setTotalWidth] = useState(0)
  const { classes } = useStyles()
  const ref = useRef<HTMLDivElement | null>(null)
  const selectData = useMemo(
    () => {
      if (column.field !== 'singleSelect') return []

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
      <Radio.Group
        offset={0}
        orientation={totalWidth > 250 ? 'vertical' : 'horizontal'}
        ref={ref}
        display='inline-flex'
      >
        {selectData.map(s => (
          <Radio value={s.value} key={s.value} label={s.label} />
        ))}
      </Radio.Group>
    )
  }

  return (
    !denyEdit
      ? <Select
          defaultValue={String(data)}
          data={selectData}
          placeholder="Pick all that you like"
          searchable
          dropdownPosition='flip'
          onChange={onChange}
          nothingFound="Nothing found"
        />
      : <Text className={classes.tag}>{String(data)}</Text>
  )
}
