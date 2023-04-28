import { colors } from '@appser/ui'
import { Box, Divider, createStyles, getStylesRef } from '@appser/ui'
import { useEffect, useRef, useState } from 'react'

import type { DefaultProps, Selectors } from '@appser/ui'
import type { PropsWithChildren } from 'react'

interface StylesParams {
  animate: boolean
  collapsed: boolean
  handlePosition: 'left' | 'right'
}
type ResizableStylesNames = Selectors<typeof useStyles>

const useStyles = createStyles((theme, { animate, collapsed, handlePosition }: StylesParams) => ({
  root: {
    position: 'relative',
    height: '100%',
    flexShrink: 0,
    pointerEvents: collapsed ? 'none' : undefined
  },
  panel: {
    overflow: 'hidden',
    position: 'relative',
    zIndex: 9,
    transition: !animate ? 'none' : 'transform .2s ease,opacity .2s ease,-webkit-transform .2s ease'
  },
  resizer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 12,
    [handlePosition === 'right' ? 'marginLeft' : 'marginRight']: -8,
    zIndex: 999,
    cursor: 'col-resize',
    display: collapsed ? 'none' : 'block',
    [`&:hover .${getStylesRef('resizeBar')}`]: {
      backgroundColor: theme.colors.blue[7],
      transitionDelay: '0.3s'
    }
  },
  resizeBar: {
    height: '100%',
    [handlePosition]: 3,
    top: 0,
    ref: getStylesRef('resizeBar'),
    position: 'absolute',
    width: 3
  },
  resizeMask: {
    ...theme.fn.cover(),
    position: 'fixed',
    zIndex: 1000,
    userSelect: 'none',
    cursor: 'col-resize !important'
  },
  border: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    [handlePosition]: 0,
    zIndex: 998,
    borderRight: `1px solid ${colors[theme.colorScheme].border}`
  }
}))

interface ResizablePanelsProps extends PropsWithChildren, DefaultProps<ResizableStylesNames, StylesParams> {
  onResize?: (w: number) => void
  collapsed?: boolean
  animate?: boolean
  withBorder?: boolean
  defaultWidth?: number
  maxWidth?: number
  handlePosition?: 'left' | 'right'
  onTransitionEnd?: (c: boolean) => void
}

const ResizablePanels = ({
  children,
  onResize,
  collapsed,
  animate,
  defaultWidth = 230,
  maxWidth = 500,
  handlePosition = 'right',
  classNames,
  styles,
  unstyled,
  withBorder,
  onTransitionEnd
}: ResizablePanelsProps) => {
  const { classes } = useStyles({ animate: !!animate, collapsed: !!collapsed, handlePosition }, { name: 'ResizablePanels', classNames, styles, unstyled })
  const recordRef = useRef<{ startX: number; mouseState?: 'end' | 'start' | 'moving' }>({
    startX: 0,
    mouseState: 'end'
  })
  const [_, render] = useState(false)
  const sideWidth = useRef(defaultWidth)
  const resizerPosition = useRef(defaultWidth)

  const onTriggerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    recordRef.current.startX = e.pageX
    recordRef.current.mouseState = 'start'

    const unbindEvents = () => {
      window.removeEventListener('mouseup', moveEnd)
      window.removeEventListener('mousemove', moving)
    }

    const bindEvents = () => {
      window.addEventListener('mousemove', moving)
      window.addEventListener('mouseup', moveEnd)
    }

    function moveEnd() {
      recordRef.current.mouseState = 'end'
      document.body.style.cursor = 'default'

      sideWidth.current = resizerPosition.current
      onResize?.(sideWidth.current)

      render(x => !x)
      unbindEvents()
    }

    function moving(e: MouseEvent) {
      const offsetX = e.pageX - recordRef.current.startX
      recordRef.current.mouseState = 'moving'
      let diff = e.pageX - defaultWidth
      resizerPosition.current = sideWidth.current + offsetX

      if (handlePosition === 'left') {
        diff = document.body.clientWidth - e.pageX - defaultWidth
        resizerPosition.current = sideWidth.current - offsetX
      }

      const critical = Math.min(Math.max(diff / (maxWidth - defaultWidth), 0), 1)

      if (critical === 0) {
        resizerPosition.current = defaultWidth
      }

      if (critical === 1) {
        resizerPosition.current = maxWidth
      }

      render(x => !x)
    }

    bindEvents()
    document.body.setAttribute('style', 'cursor: col-resize !important')
  }

  useEffect(() => {
    if (recordRef.current.mouseState === 'moving') return

    if (collapsed) {
      onResize?.(0)
    }
    else {
      onResize?.(sideWidth.current)
    }
  }, [collapsed])

  return (
    <Box className={classes.root}>
      <Box
        h='100%'
        w={sideWidth.current}
        sx={{
          flex: `0 0 ${sideWidth.current}px`,
          transform: collapsed ? `translate3d(${handlePosition === 'right' ? -100 : 100}%,0,0)` : 'translateZ(0)',
          opacity: collapsed ? 0 : 1
        }}
        className={classes.panel}
        onTransitionEnd={() => onTransitionEnd?.(!!collapsed)}
      >
        {withBorder && <Box className={classes.border} />}
        {children}
      </Box>

      <Box
        style={{
          [handlePosition === 'right' ? 'left' : 'right']: resizerPosition.current
        }}
        onMouseDown={(e: any) => {
          e.stopPropagation()
          onTriggerMouseDown(e)
        }}
        className={classes.resizer}
      >
        <Box
          className={classes.resizeBar}
          sx={theme => ({
            backgroundColor: recordRef.current.mouseState !== 'end' ? theme.colors.blue[7] : 'transparent'
          })}
        />
      </Box>
      {recordRef.current.mouseState !== 'end' && <Box className={classes.resizeMask} />}
    </Box>
  )
}

export default ResizablePanels
