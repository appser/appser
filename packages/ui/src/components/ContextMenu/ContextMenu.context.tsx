import { createContext } from 'react'

import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'

interface ContextMenuStatus {
  isOpen: boolean
  clientX: number
  clientY: number
}

interface ContextMenuContextProviderProps extends PropsWithChildren {
  status: ContextMenuStatus
  setStatus: Dispatch<SetStateAction<ContextMenuStatus>>
}

export const ContextMenuContext = createContext<ContextMenuContextProviderProps | null>(null)
