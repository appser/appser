import type { FieldIconProps } from '..'

export const urlIcon = ({ color, size }: FieldIconProps) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="${size}" height="${size}" stroke="${color}"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-.5.5"/><path d="M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l.5-.5"/></svg>`
}
