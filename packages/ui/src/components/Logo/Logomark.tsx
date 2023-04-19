import { createStyles } from '@mantine/core'

import type { FC } from 'react'

interface Props {
  color?: string
  size?: number
}

const useStyles = createStyles(theme => ({
  svg: {
    fill: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.fn.primaryColor()
  }
}))

export const Logomark: FC<Props> = ({ size = '30' }) => {
  const { classes } = useStyles()

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 879 879"><g fill="none" fillRule="nonzero"><path fill="#A4D494" d="M670 573c0 169-137 306-306 306V597a54.94 54.94 0 0 0 45.44-24H670Z" /><path fill="#6DBA55" d="m197.97 195 152.34 293.72A55 55 0 0 0 364 597l-.01 282C162.97 879 0 716.98 0 517.13 0 376.73 80.43 255 197.97 195Z" /><path fill="#397D22" d="M364 155v332c-4.7 0-9.34.6-13.7 1.72L197.98 195A363.82 363.82 0 0 1 364 155Z" /><path fill="#49A92A" d="M364 0c147.71 0 286.58 66.05 378.42 163.13C826.43 251.93 879 383.95 879 515H411.93A54.98 54.98 0 0 0 364 487V0Zm314 295a66 66 0 1 0 0 132 66 66 0 0 0 0-132Z" /></g></svg>
  )
}
