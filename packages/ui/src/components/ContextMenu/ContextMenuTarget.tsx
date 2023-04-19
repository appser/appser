import { cloneElement, isValidElement, useContext } from 'react'

import { ContextMenuContext } from './ContextMenu.context'

import type { FC, MouseEvent, PropsWithChildren, ReactElement } from 'react'

export interface ContextMenuTargetProps extends PropsWithChildren {
  onShouldOpen?: (e: MouseEvent) => boolean
  onContextMenu?: (e: MouseEvent) => void
}

export const ContextMenuTarget: FC<ContextMenuTargetProps> = ({ children, onShouldOpen }) => {
  const ctx = useContext(ContextMenuContext)

  if (!isValidElement(children)) return null

  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    children.props.onContextMenu?.(e)

    if (typeof onShouldOpen === 'function' && !onShouldOpen(e)) return
    if (typeof onShouldOpen === 'boolean' && !onShouldOpen) return

    const { clientX, clientY } = e

    ctx?.setStatus({
      isOpen: true,
      clientX,
      clientY
    })
  }

  return cloneElement(children as ReactElement, {
    onContextMenu
  })
}
