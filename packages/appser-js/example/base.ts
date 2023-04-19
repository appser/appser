import Client from '../src/index.node'

const foo = new Client({
  endpoint: 'http://127.0.0.1:7900',
  withCredentials: true
})

foo.request.config.TOKEN = 'test'

foo.auth
  .authByEmail({
    requestBody: {
      email: 'demo@appser.run',
      password: '123456'
    }
  })
  .then(res => {
    console.log('res', res)
  })
  .catch(e => {
    console.log('e', e)
  })
