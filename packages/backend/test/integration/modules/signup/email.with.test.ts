import { server } from 'backend/index'
import request from 'supertest'

const a = request(server.callback())
  .post('/signup/email')
  .send({ email: '111' })
  .expect(400)

console.log(a)
