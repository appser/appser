import { z } from 'zod'

const a = z.object({
  title: z.string().max(255).trim()
}).transform((val) => {
  return '1'
})
const data = a.parse({ title: 'test' })

console.log(a.parse({ title: 'test' }))
