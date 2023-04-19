import run from './run'

export default run().catch(e => {
  console.log(e)
  process.exit(1)
})
