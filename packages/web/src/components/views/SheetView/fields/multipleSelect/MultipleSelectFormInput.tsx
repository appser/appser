import { Checkbox, Group, MultiSelect, Text, createStyles } from '@appser/ui'
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

// TODO: bugfix
export const MultipleSelectFormInput: FC<FieldFormInputProps> = ({ field, onChange, defaultValue: defaultData, denyEdit }) => {
  const [totalWidth, setTotalWidth] = useState(0)
  const { classes } = useStyles()
  const ref = useRef<HTMLDivElement | null>(null)
  const data = useMemo(
    () => {
      if (field.type !== 'multipleSelect') return []

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
      <Checkbox.Group
        spacing={15}
        offset={0}
        orientation={totalWidth > 230 ? 'vertical' : 'horizontal'}
        ref={ref}
        display='inline-flex'
      >
        {data.map(s => (
          <Checkbox disabled={denyEdit} value={s.value} key={s.value} label={s.label} />
        ))}
      </Checkbox.Group>
    )
  }

  return (
    denyEdit
      ? (
        <Group>
          {[1, 2, 4, 5, 6, 7, 8, 9, 10, 11].map(d => (
            <Text key={d} className={classes.tag}>{d}</Text>
          ))}
        </Group>
        )
      : <MultiSelect
          data={data}
          variant='filled'
          placeholder="Pick all that you like"
          searchable
          dropdownPosition='flip'
          onChange={onChange}
          nothingFound="Nothing found"
        />
  )
}
