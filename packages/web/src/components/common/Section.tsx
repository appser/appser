import { Flex, Divider as OriginDivider, Text, createStyles } from '@appser/ui'

import type { FC } from 'react'

interface SectionProps {
  title?: string
  children: React.ReactNode
}

interface SectionItemProps {
  label?: string
  children?: React.ReactNode
}

const useStyles = createStyles((theme) => ({
  section: {
    border: '1px solid red',
    borderRadius: theme.radius.md
  }
}))

export function Section({ title, children }: SectionProps) {
  const { classes } = useStyles()

  return <Flex direction="column" p="sm" className={classes.section}>{children}</Flex>
}

const Item: FC<SectionItemProps> = ({ label, children }) => {
  return (
    <Flex align="center" justify="space-between">
      <Text>{label}</Text>
      {children}
    </Flex>
  )
}

const Divider = () => <OriginDivider mt="sm" mb='sm' />

Section.Item = Item
Section.Divider = Divider
