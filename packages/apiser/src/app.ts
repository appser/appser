import Koa from 'koa'
import logger from 'koa-pino-logger'

import config from './config'
import * as error from './error'
import * as request from './request'
import * as router from './route'

const app: Koa = new Koa()

request.parseQuerystring(app)

app.use(logger(config.logger))
app.use(request.parseBody)
app.use(error.res)
app.use(router.load())
app.on('error', error.on)

export default app
