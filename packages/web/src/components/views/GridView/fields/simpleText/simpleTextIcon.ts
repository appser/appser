import type { FieldIconProps } from '..'

export const simpleTextIcon = ({ color, size }: FieldIconProps) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none"  width="${size}" height="${size}" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon icon-tabler icon-tabler-letter-case" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M14 15.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 1 0-7 0M3 19V8.5a3.5 3.5 0 0 1 7 0V19M3 13h7M21 12v7"/></svg>`
}
