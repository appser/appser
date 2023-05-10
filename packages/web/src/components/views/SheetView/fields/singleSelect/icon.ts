import type { FieldIconProps } from '..'

export const singleSelectIcon = ({ color, size }: FieldIconProps) => {
  return `<svg t="1672387027101" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4709" width="20" height="20"><path d="M610.496 622.336l0.085333 0.085333-60.352 60.330667-196.096-196.096 60.330667-60.330667 135.68 135.68L810.666667 301.44V170.666667H213.333333v682.666666h597.333334V543.914667l85.333333-93.226667V938.666667H128V85.333333h768v251.306667l-18.56 18.56 0.106667 0.085333-267.050667 267.050667z" fill="#000000" p-id="4710"></path></svg>`

  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="${size}" height="${size}" stroke="${color}"  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon icon-tabler icon-tabler-mail" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m3 7 9 6 9-6"/></svg>`
}
