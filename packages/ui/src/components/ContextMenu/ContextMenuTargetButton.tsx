import { cloneElement, isValidElement, useContext } from 'react'

import { ContextMenuContext } from './ContextMenu.context'

import type { FC, MouseEvent, PropsWithChildren, ReactElement } from 'react'

export interface ContextMenuTargetButtonProps extends PropsWithChildren {
  onShouldOpen?: (e: MouseEvent) => boolean
  onClick?: (e: MouseEvent) => void
}

export const ContextMenuTargetButton: FC<ContextMenuTargetButtonProps> = ({ children, onShouldOpen }) => {
  const ctx = useContext(ContextMenuContext)

  if (!isValidElement(children)) return null

  const onClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    children.props.onClick?.(e)

    if (typeof onShouldOpen === 'function' && !onShouldOpen(e)) return
    if (typeof onShouldOpen === 'boolean' && !onShouldOpen) return

    const { currentTarget } = e
    const { top, left } = currentTarget.getBoundingClientRect()
    const { offsetHeight } = (currentTarget as HTMLButtonElement)
    ctx?.setStatus({
      isOpen: true,
      clientX: left,
      clientY: top + offsetHeight
    })
  }

  return cloneElement(children as ReactElement, {
    'aria-menu-opened': ctx?.status.isOpen ? true : undefined,
    onClick
  })
}
