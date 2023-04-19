import type { Command } from 'commander'

const { spawn } = require('cross-spawn')

export default function dev(program: Command) {
  program.command('dev').action(() => {
    spawn('tsx', ['watch', require.resolve('../apiser.ts').toString()], {
      stdio: ['inherit', 'inherit', 'inherit'],
      env: {
        ...process.env,
        DEBUG: 'apiser:*,koa-router,koa:*,knex:bindings,knex:query,apiser:*'
      }
    })
  })
}
