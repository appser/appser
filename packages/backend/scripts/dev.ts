import { start } from 'backend/index'

start().catch(e => {
  console.log(e)
  process.exit(1)
})
