import { ReactComponent as AlignCenter } from './alignCenter.svg'
import { ReactComponent as BorderBottom } from './borderBottom.svg'
import { ReactComponent as Calibrate } from './calibrate.svg'
import { ReactComponent as EditFade } from './editFade.svg'
import { ReactComponent as Feed } from './feed.svg'
import { ReactComponent as FormatSeparator } from './formatSeparator.svg'
import { ReactComponent as Magnet } from './magnet.svg'
import { ReactComponent as Overflow } from './overflow.svg'
import { ReactComponent as Today } from './today.svg'

import type { datasetIconIds } from '@appser/shared'
import type { FC } from 'react'

interface AppImageProps {
  id: typeof datasetIconIds[number] | string
  size?: number
}

export const IconApp: FC<AppImageProps> = ({ id, size = 52 }) => {
  switch (id) {
    case 'borderBottom':
      return <BorderBottom width={size} height={size} />

    case 'alignCenter':
      return <AlignCenter width={size} height={size} />

    case 'calibrate':
      return <Calibrate width={size} height={size} />

    case 'editFade':
      return <EditFade width={size} height={size} />

    case 'feed':
      return <Feed width={size} height={size} />

    case 'formatSeparator':
      return <FormatSeparator width={size} height={size} />

    case 'magnet':
      return <Magnet width={size} height={size} />

    case 'overflow':
      return <Overflow width={size} height={size} />

    case 'today':
      return <Today width={size} height={size} />

    default:
      return null
  }
}
