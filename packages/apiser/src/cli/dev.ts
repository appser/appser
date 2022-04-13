import { join } from 'path'
const dev = require('node-dev')

export default function (options: any) {
  const entry = join(__dirname, '..', 'server.ts')
  const nodeArgs = []

  if (!process.env.DEBUG) {
    process.env.DEBUG = 'apiser:*,koa:*'
  }

  if (options.inspect) {
    nodeArgs.push('--inspect')
  }

  dev(entry, [], nodeArgs, {
    clear: false,
    dedupe: false,
    fork: true,
    notify: false,
    poll: false,
    vm: true,
    debounce: 10,
    deps: 1,
    extensions: {
      ts: 'ts-node/register'
    },
    graceful_ipc: '',
    ignore: [],
    interval: 100,
    timestamp: 'HH:MM:ss'
  })
}
