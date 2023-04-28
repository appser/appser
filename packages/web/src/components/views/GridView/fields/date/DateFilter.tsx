import { Group, Select } from '@appser/ui'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@appser/ui'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'

import type { FieldFilterProps } from '..'
import type { TransformedValues } from '@appser/ui'
import type { FC } from 'react'
import type { FilterConditionOperator } from 'web/servers/dataset/useQueryRecord'

const THIS_WEEK = 'DATE_START_OF(NOW(),"w")'
const THIS_MONTH = 'DATE_START_OF(NOW(),"M")'
const YESTERDAY = 'DATE_ADD(NOW(),-1,"d")'
const TOMORROW = 'DATE_ADD(NOW(),1,"d")'

export const DateFilter: FC<FieldFilterProps> = ({ onChange, conditionValueDetail }) => {
  const form = useForm({
    initialValues: {
      operator: conditionValueDetail?.operator ?? 'between',
      value: conditionValueDetail?.value ?? '$customDate'
    },
    transformValues(values) {
      if (typeof values.value === 'string' || Array.isArray(values.value)) {
        const [start, end, bounds] = typeof values.value === 'string' ? values.value.split(',') : values.value

        if (dayjs(start).isValid() && dayjs(end).isValid() && bounds) {
          const value = dayjs(start).add(1, 'd').isSame(dayjs(end))
            ? '$customDate'
            : '$customRangeDate'

          return {
            ...values,
            value,
            custom: {
              start: dayjs(start).toDate(),
              end: dayjs(end).toDate()
            }
          }
        }
      }

      return { ...values, custom: {} }
    }
  })
  const transformedValues = form.getTransformedValues() as TransformedValues<typeof form>
  const operatorData = [
    { label: '等于', value: 'between' },
    { label: '早于', value: 'lt' },
    { label: '晚于', value: 'gt' },
    { label: '为空', value: 'null' },
    { label: '不为空', value: 'notNull' }
  ] as const

  const valueData = useMemo(() => {
    switch (form.values.operator) {
      case 'between':
        return [
          { label: '具体日期', value: '$customDate' },
          { label: '具体时间段', value: '$customRangeDate' },
          { label: '今天', value: `=ARG2ARRAY(TODAY(),${TOMORROW},"[)")` },
          { label: '明天', value: `=ARG2ARRAY(${TOMORROW},DATE_ADD(TODAY(),2,"d"),"[)")` },
          { label: '昨天', value: `=ARG2ARRAY(${YESTERDAY},TODAY(),"[)")` },
          { label: '本周', value: `=ARG2ARRAY(${THIS_WEEK},DATE_ADD(${THIS_WEEK},1,"w"),"[)")` },
          { label: '上周', value: `=ARG2ARRAY(DATE_ADD(${THIS_WEEK},-1,"w"),${THIS_WEEK},"[)")` },
          { label: '本月', value: `=ARG2ARRAY(${THIS_MONTH},DATE_ADD(${THIS_MONTH},1,"M"),"[)")` },
          { label: '上月', value: `=ARG2ARRAY(DATE_ADD(${THIS_MONTH},-1,"M"),${THIS_MONTH},"[)")` },
          { label: '过去 7 天内', value: `=ARG2ARRAY(DATE_ADD(TODAY(),-7,"d"),TODAY(),"[)")` },
          { label: '未来 7 天内', value: '=ARG2ARRAY(TODAY(),DATE_ADD(TODAY(),7,"d"),"[)")' },
          { label: '过去 30 天内', value: `=ARG2ARRAY(DATE_ADD(TODAY(),-30,"d"),TODAY(),"[)")` }
        ]
      case 'lt': case 'gt':
        return [
          { label: '具体时间', value: '$customDate' },
          { label: '今天', value: `TODAY()` },
          { label: '明天', value: `TODAY(1,'d')` },
          { label: '昨天', value: `TODAY(-1,'d')` }
        ]

      case 'null': case 'notNull':
        return null

      default:
        return null
    }
  }, [form.values.operator])

  useEffect(() => {
    if (form.values.value !== '$customDate' && form.values.value !== '$customRangeDate') {
      console.log(form.values)
      onChange?.(form.values)
    }
  }, [form.values])

  return (
    <Group spacing={0} noWrap>
      <Select
        w={100}
        defaultValue={form.values.operator}
        onChange={v => v && form.setFieldValue('operator', v as FilterConditionOperator)}
        data={operatorData}
      />
      {valueData && (
      <>
        <Select
          w={100}
          data={valueData}
          defaultValue={String(transformedValues.value)}
          onChange={v => v && form.setFieldValue('value', v)}
        />
        {transformedValues.value === '$customDate' && (
          <DatePickerInput
            defaultValue={transformedValues.custom?.start}
            placeholder="Pick date"
            onChange={v => v && form.setFieldValue(
              'value',
              [dayjs(v).startOf('d').toISOString(), dayjs(v).startOf('d').add(1, 'd').toISOString(), '[)']
            )}
          />
        )}
        {transformedValues.value === '$customRangeDate' && (
          <DatePickerInput
            type='range'
            placeholder="Pick date range"
            defaultValue={transformedValues.custom?.start && transformedValues.custom?.end && [transformedValues.custom?.start, transformedValues.custom?.end]}
            onChange={([start, end]) => start && end && form.setFieldValue(
              'value',
              [dayjs(start).startOf('d').toISOString(), dayjs(end).startOf('d').toISOString(), '[)']
            )}
          />
        )}
      </>
      )}
    </Group>
  )
}
