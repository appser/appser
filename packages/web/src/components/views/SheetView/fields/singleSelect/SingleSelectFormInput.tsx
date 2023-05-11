import { Box, Radio, Select, Text, createStyles } from '@appser/ui'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { FieldFormInputProps } from '..'
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

export const SingleSelectFormInput: FC<FieldFormInputProps> = ({ field, onChange, defaultValue: defaultData, denyEdit }) => {
  const [totalWidth, setTotalWidth] = useState(0)
  const { classes } = useStyles()
  const ref = useRef<HTMLDivElement | null>(null)
  const data = useMemo(
    () => {
      if (field.type !== 'singleSelect') return []

      return field.options.items.map(({ id, name }, i) => ({
        value: id ?? String(i),
        label: name
      }))
    }
    , [field]
  )

  useLayoutEffect(() => setTotalWidth(ref?.current?.clientWidth ?? 0), [])

  if (data.length < 4) {
    return (
      <Radio.Group
        offset={0}
        orientation={totalWidth > 250 ? 'vertical' : 'horizontal'}
        ref={ref}
        display='inline-flex'
      >
        {data.map(s => (
          <Radio value={s.value} key={s.value} label={s.label} />
        ))}
      </Radio.Group>
    )
  }

  return (
    !denyEdit
      ? <Select
          defaultValue={String(defaultData)}
          data={data}
          placeholder="Pick all that you like"
          searchable
          dropdownPosition='flip'
          onChange={onChange}
          nothingFound="Nothing found"
        />
      : <Text className={classes.tag}>{String(defaultData)}</Text>
  )
}
