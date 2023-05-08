import db from 'backend/db'

db.seed.run().then(l => {
  console.log(l)
})
