import type { FieldIconProps } from '..'

export const dateIcon = ({ color, size }: FieldIconProps) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="${size}" height="${size}" stroke="${color}"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 3v4M8 3v4M4 11h16"/><path d="M8 15h2v2H8z"/></svg>`
}
