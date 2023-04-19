import { Box, CloseButton, Flex, MultiSelect, Text } from '@mantine/core'
import { forwardRef } from 'react'

import { UserAvatar } from '../user/UserAvatar'

import type { MultiSelectProps, MultiSelectValueProps, SelectItemProps } from '@mantine/core'
import type { FC } from 'react'

export interface UserSelectItem {
  label: string
  value: string
  avatar?: string
  disabled?: boolean
}

interface Props extends Partial<MultiSelectProps> {
  data: UserSelectItem[]
}

const Item = forwardRef<HTMLDivElement, SelectItemProps & UserSelectItem>(({ label, disabled, avatar, value, ...others }, ref) => {
  return (
    <Box ref={ref} {...others}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box mr={10}>
          <UserAvatar size="md" user={{ name: String(label), avatar }} />
        </Box>
        <Flex direction='column'>
          <div>{label}</div>
          <div>{disabled ? '已邀请' : '未邀请'}</div>
        </Flex>

      </Box>
    </Box>
  )
})

export const OrgUserSelect: FC<Props> = ({ data, ...rest }) => {
  return (
    <MultiSelect
      data={data}
      withinPortal
      limit={20}
      valueComponent={Value}
      itemComponent={Item}
      searchable
      placeholder="Select member from org"
      {...rest}
    />
  )
}

function Value({
  value,
  label,
  avatar,
  disabled,
  onRemove,
  classNames,
  ...others
}: MultiSelectValueProps & UserSelectItem) {
  return (
    <Box {...others}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          cursor: 'default',
          alignItems: 'center',
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          paddingLeft: 5,
          borderRadius: 4
        })}
      >
        <Box mr={5}>
          <UserAvatar size="xs" user={{ name: label, avatar }} />
        </Box>
        <Box sx={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          size={22}
          iconSize={14}
          tabIndex={-1}
        />
      </Box>
    </Box>
  )
}
