import Client from '@appser/appser-js'

const db = new Client({
  endpoint: '/api',
  withCredentials: true
})

export default db
