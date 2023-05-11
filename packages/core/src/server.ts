import modules from './modules'
import { Server } from './server/index'

const server = new Server()

server
  .mount(modules)
  .sleep(0)

export default server
