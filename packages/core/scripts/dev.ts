import { start } from '../src'

start().catch(e => {
  console.log(e)
  process.exit(1)
})
