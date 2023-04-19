import { program } from 'commander'

import dev from './dev'

program.name('appser').description('appser is a no-code database').version(require('../../package.json').version)

dev(program)

program.parse()
