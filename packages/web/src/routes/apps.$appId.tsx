import { colors } from '@appser/ui'
import { CompactSelection } from '@glideapps/glide-data-grid'
import { ActionIcon, Box, Divider, Flex, Group, Title, createStyles } from '@appser/ui'
import { useResizeObserver } from '@appser/ui'
import { IconChevronLeft, IconLayoutSidebarLeftExpand, IconLayoutSidebarRightExpand } from '@tabler/icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, redirect, useNavigate, useParams } from 'react-router-dom'
import { AppBreadcrumbs } from 'web/components/app/AppBreadcrumbs'
import { AppLogo } from 'web/components/app/AppLogo'
import { AppMemberGroup } from 'web/components/app/AppMemberGroup'
import { AppNavbar } from 'web/components/app/AppNavbar'
import { AppNavbarPopover } from 'web/components/app/AppNavbarPopover'
import { AppRightSidebar } from 'web/components/app/AppRightSidebar'
import { ActionButton } from 'web/components/common/ActionButton'
import ResizablePanels from 'web/components/common/ResizablePanels'
import { useGridSelection } from 'web/components/views/GridView/hooks/useGridSelection'
import { useActivatedApp } from 'web/hooks/useActivatedApp'
import { getAppQuery } from 'web/servers/app/queries'
import { useGetApp } from 'web/servers/app/useGetApp'
import { loadQueryData } from 'web/utils/loadQueryData'

import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'

export const loader = (queryClient: QueryClient) => async ({ request, params }: LoaderFunctionArgs) => {
  const { appId = '' } = params
  const { pathname } = new URL(request.url)
  const app = await loadQueryData(queryClient, getAppQuery({ appId }))
  const lastDataset = app.datasets[0]
  const lastView = lastDataset.views[0]

  if (lastView && pathname === `/apps/${appId}`) {
    throw redirect(`/apps/${appId}/d/${lastDataset.id}/v/${lastView.id}`)
  }

  return { app }
}

const useStyles = createStyles(theme => ({
  header: {
    minHeight: '50px',
    borderBottom: `1px solid ${colors[theme.colorScheme].border}`,
    width: '100%',
    zIndex: 100,
    position: 'fixed',
    alignItems: 'center'
  },
  datasetTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    WebkitLineClamp: 1,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    flex: 1
  },
  tableContainer: {
    flex: 1,
    paddingTop: 50,
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0
  },
  rightBar: {
    height: '100%',
    borderLeft: `1px solid ${colors[theme.colorScheme].border}`,
    paddingTop: 50
  },
  sideBarHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingLeft: 9,
    paddingRight: 5,
    position: 'relative',
    minWidth: 131,
    overflow: 'hidden',
    '&:before': {
      content: "''",
      zIndex: -1,
      left: 0,
      top: 0,
      position: 'absolute',
      backgroundColor: theme.colorScheme === 'light' ? 'white' : theme.colors.dark[7],
      width: 'calc(100% - 1px)',
      height: '100%'
    }
  },
  rightBarHeader: {
    height: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'fixed',
    right: 0,
    top: 0,
    zIndex: 102,
    backgroundColor: theme.colorScheme === 'light' ? 'white' : theme.colors.dark[7],
    minWidth: 60
  },
  sideBarHeaderLogo: {
    width: 'auto',
    height: 'auto',
    padding: '3px 7px',
    ...theme.fn.hover({
      '& .datasetLogo': {
        display: 'none'
      },
      '& .backLogo': {
        display: 'block'
      }
    })
  }
}))

export default function AppsId() {
  const navigate = useNavigate()
  const { classes } = useStyles()
  const { appId = '' } = useParams()
  const [,setActivatedApp] = useActivatedApp()
  const { data: app } = useGetApp(appId)
  const { selection } = useGridSelection()
  const [leftSidebarState, setLeftSidebarState] = useState({
    width: 230,
    animate: false,
    collapsed: false
  })
  const [rightSidebarState, setRightSidebarState] = useState({
    width: 0,
    animate: false,
    collapsed: true
  })
  const [tableRightSize, setTableRightSize] = useState(0)
  const [ref, rect] = useResizeObserver()
  const rightSideCollapseFlag = useRef(false)
  const { setSelection } = useGridSelection()

  const expandRightSidebar = (status: boolean | 'toggle') => {
    setRightSidebarState((state) => ({
      ...state,
      collapsed: status === 'toggle' ? !state.collapsed : !status,
      animate: true
    }))
  }

  const closeRightSidebar = useCallback(() => {
    if (!rightSidebarState.collapsed) {
      rightSideCollapseFlag.current = true
      setTableRightSize(0)
    }
  }, [rightSidebarState.collapsed])

  useEffect(() => {
    setActivatedApp(app)

    return () => setActivatedApp(null)
  }, [app])

  useEffect(() => {
    if (rightSideCollapseFlag.current) {
      expandRightSidebar(false)
      setSelection({
        rows: CompactSelection.empty(),
        columns: CompactSelection.empty()
      })
      rightSideCollapseFlag.current = false
    }
  }, [rect])

  // useEffect(() => {
  //   setSelection({
  //     rows: CompactSelection.empty(),
  //     columns: CompactSelection.empty()
  //   })
  // }, [])

  useEffect(() => {
    const rows = selection.rows.toArray()
    // console.log(rows)

    if (rows.length === 1) {
      expandRightSidebar(true)
    } else {
      closeRightSidebar()
    }
  }, [selection.rows])

  if (!app) return null

  return (
    <Flex direction="column" h='100vh'>
      <Flex className={classes.rightBarHeader} pr='sm'>
        <ActionIcon size="lg"
          onClick={() => {
            if (rightSidebarState.collapsed) {
              expandRightSidebar(true)
            } else {
              closeRightSidebar()
            }
          }}
        >
          <IconLayoutSidebarRightExpand size={22} />
        </ActionIcon>
      </Flex>

      <Flex
        className={classes.header}
        sx={{ transition: rightSidebarState.animate ? 'padding .2s ease' : 'none' }}
        onTransitionEnd={() => setRightSidebarState(prev => ({ ...prev, animate: false }))}
        pr={rightSidebarState.width || 60}
      >
        <Flex
          className={classes.sideBarHeader}
          sx={{
            width: leftSidebarState.width,
            transition: !leftSidebarState.animate ? 'none' : 'width .2s ease'
          }}
        >
          <Group spacing={3} align="center" sx={{ flex: 1 }}>
            <ActionIcon
              className={classes.sideBarHeaderLogo}
              onClick={() => navigate('/')}
            >
              <Box className='datasetLogo'>
                <AppLogo icon={app.icon} tintColor={app.tintColor} size={24} />
              </Box>
              <Box className='backLogo' sx={{ display: 'none' }}>
                <IconChevronLeft />
              </Box>
            </ActionIcon>
            <Title className={classes.datasetTitle} order={6}>{app.name}</Title>
          </Group>

          <Group
            spacing={3}
            sx={{
              marginLeft: 5,
              width: leftSidebarState.collapsed ? 69 : 42,
              alignItems: 'center',
              overflow: 'hidden',
              flexWrap: 'nowrap',
              transition: 'transform .2s ease, width .2s ease'
            }}
          >
            <ActionButton
              sx={{ flex: '0 0 42px' }}
              onClick={() => setLeftSidebarState(prev => ({ ...prev, animate: true, collapsed: !prev.collapsed }))}
            >
              <IconLayoutSidebarLeftExpand size={26} />
            </ActionButton>
            <Divider sx={{ alignSelf: 'auto' }} h={18} orientation='vertical' />
            <AppNavbarPopover app={app} />
          </Group>
        </Flex>

        <Flex
          justify='space-between'
          h={50}
          sx={theme => ({
            flex: 1,
            backgroundColor: theme.colorScheme === 'light' ? 'white' : theme.colors.dark[7]
          })}
          pl='md'
          pr={20}
        >
          <AppBreadcrumbs current={{ app, dataset: { name: 'ddd', id: '33' }, view: { name: 'ffff', id: '33', type: 'grid' } }} />
          <AppMemberGroup app={app} />
        </Flex>
      </Flex>

      <Flex pos='relative'>
        <ResizablePanels
          animate={leftSidebarState.animate}
          collapsed={leftSidebarState.collapsed}
          defaultWidth={230}
          onTransitionEnd={() => setLeftSidebarState(prev => ({ ...prev, animate: false }))}
          maxWidth={414}
          withBorder
          onResize={(width) => setLeftSidebarState(prev => ({ ...prev, width }))}
        >
          <AppNavbar
            sx={theme => ({
              backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.colors.dark[7]
            })}
            pt={50}
          />
        </ResizablePanels>

        <Flex
          className={classes.tableContainer}
          ref={ref}
          sx={{
            left: leftSidebarState.width,
            width: `calc(100vw - ${leftSidebarState.width + tableRightSize}px)`,
            transition: `left .2s ease, padding ${rightSidebarState.collapsed || !rightSidebarState.animate ? 0 : 0.2}s`
          }}
        >
          <Outlet />
        </Flex>

        <ResizablePanels
          animate={rightSidebarState.animate}
          collapsed={rightSidebarState.collapsed}
          defaultWidth={420}
          handlePosition='left'
          maxWidth={500}
          withBorder
          onResize={(width) => {
            setRightSidebarState(prev => ({ ...prev, width }))
            setTableRightSize(width)
          }}
          styles={{
            root: {
              position: 'fixed',
              right: 0,
              zIndex: 101
            }
          }}
        >
          <AppRightSidebar />
        </ResizablePanels>

      </Flex>

      <div id="portal" />
    </Flex>
  )
}
