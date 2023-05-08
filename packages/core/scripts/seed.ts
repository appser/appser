import db from 'core/db'

db.seed.run().then(l => {
  console.log(l)
})
