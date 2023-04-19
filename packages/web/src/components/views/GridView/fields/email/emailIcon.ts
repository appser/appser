import type { FieldIconProps } from '..'

export const emailIcon = ({ color, size }: FieldIconProps) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="${size}" height="${size}" stroke="${color}"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon icon-tabler icon-tabler-mail" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m3 7 9 6 9-6"/></svg>`
}
