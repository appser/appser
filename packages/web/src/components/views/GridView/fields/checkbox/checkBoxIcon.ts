import type { FieldIconProps } from '..'

export const checkBoxIcon = ({ color, size }: FieldIconProps) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="${size}" height="${size}" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"  viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="m9 12 2 2 4-4"/></svg>`
}
