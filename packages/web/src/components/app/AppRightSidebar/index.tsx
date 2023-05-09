import { colors } from '@appser/ui'
import { Box, Tabs, createStyles } from '@appser/ui'
import { IconApiApp } from '@tabler/icons'
import { useEffect, useState } from 'react'
import { useDataSource } from 'web/components/views/GridView/hooks/useDataSource'
import { useGridSelection } from 'web/components/views/GridView/hooks/useGridSelection'
import { RowSideView } from 'web/components/views/GridView/row/RowSideView'

import { NoRowSelected } from './NoRowSelected'

import type { FC } from 'react'
import type { Row } from 'web/components/views/GridView/row/Row'

const useTabStyles = createStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  tabList: {
    display: 'flex',
    flexFlow: 'row wrap',
    WebkitBoxPack: 'start',
    justifyContent: 'flex-start',
    paddingRight: 12,
    height: 50,
    boxSizing: 'content-box',
    flex: '0 0 50px',
    alignItems: 'center',
    paddingLeft: 15,
    borderBottom: `1px solid ${colors[theme.colorScheme].border}`
  },
  tabIcon: {
    display: 'flex',
    alignItems: 'center',
    color: 'inherit'
  },
  panel: {
    flex: '1 1 0%',
    paddingRight: 10,
    overflowX: 'hidden',
    overflowY: 'scroll'
  },
  tab: {
    ...theme.fn.focusStyles(),
    border: '0 none',
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    '&[data-active]': {
      backgroundColor: 'transparent',
      borderColor: theme.fn.primaryColor(theme.colorScheme),
      color: theme.fn.primaryColor(theme.colorScheme),
      ...theme.fn.hover({ backgroundColor: 'transparent' })
    },
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'light' ? theme.fn.rgba('#000', 0.05) : theme.colors.dark[6]
    }),
    width: 34,
    height: 34,
    overflow: 'hidden',
    marginRight: 8
  }
}))

export const AppRightSidebar: FC = () => {
  const { classes } = useTabStyles()
  const { getRow, columns } = useDataSource()
  const { selection } = useGridSelection()
  const [row, setRow] = useState<Row>()

  useEffect(() => {
    const row = getRow(selection.rows.toArray()[0])
    setRow(row)
  }, [selection.rows])

  if (!row) return <NoRowSelected />

  return (
    <Box
      sx={theme => ({
        height: '100%',
        // borderLeft: `1px solid ${colors[theme.colorScheme].border}`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : 'white'
      })}
    >
      <Tabs
        unstyled
        keepMounted={false}
        defaultValue="preview"
        orientation="vertical"
        classNames={classes}
        placement="right"
      >
        <Tabs.List className={classes.tabList}>
          <Tabs.Tab icon={<IconApiApp size={22} />} value="preview" />
          <Tabs.Tab icon={<IconApiApp size={22} />} value="preview2" />
        </Tabs.List>

        <Tabs.Panel value="preview">
          <RowSideView row={row} columns={columns} />
        </Tabs.Panel>
        <Tabs.Panel value="preview2">
          <Box>1233</Box>
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}
