const fs = require('fs')
const { join } = require('path')

const parse = require('parse-gitignore')

const gitignoreFilePath = join(process.cwd(), '.gitignore')
const filenames = [
  '*.min.*',
  '*.d.ts',
  'CHANGELOG.md',
  'dist',
  'LICENSE*',
  'output',
  'coverage',
  'public',
  'temp',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  '__snapshots__',
  '!.github',
  '!.vitepress',
  '!.vscode'
]

if (fs.existsSync(gitignoreFilePath)) {
  const ignore = parse(fs.readFileSync(gitignoreFilePath, 'utf8'))
  filenames.push(...ignore.patterns)
}

module.exports = filenames
