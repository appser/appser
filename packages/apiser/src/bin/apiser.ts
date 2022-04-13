#!/usr/bin/env ts-node
import { program } from 'commander'

import dev from '../cli/dev'
import run from '../cli/run'

program
  .name('apiser')
  .description('Build API servers fast.')
  .version(require('../../package.json').version)

program.command('run').action(run)
program.command('dev').option('-i --inspect', 'Enable node inspector').action(dev)
program.command('build')

program.parse()
