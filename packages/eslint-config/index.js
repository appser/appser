const ignore = require('./ignore')
const jsonOverride = require('./overrides/json')
const mdOverride = require('./overrides/md')
const reactOverride = require('./overrides/react')
const typescriptOverride = require('./overrides/typescript')
const ymlOverride = require('./overrides/yml')
const coreRules = require('./rules/core')
const eslintCommentsRules = require('./rules/eslint-comments')
const importRules = require('./rules/import')
const nRules = require('./rules/n')
const unicornRules = require('./rules/unicorn')
const importSettings = require('./settings/import')
const reactSettings = require('./settings/react')

/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:import/recommended',
    'plugin:eslint-comments/recommended'
  ],
  ignorePatterns: ignore,
  plugins: ['html', 'unicorn', 'no-only-tests', 'node'],
  settings: {
    ...reactSettings,
    ...importSettings
  },
  rules: {
    ...coreRules,
    ...importRules,
    ...unicornRules,
    ...eslintCommentsRules,
    ...nRules
    // ...prettierRules
  },
  overrides: [
    ymlOverride,
    reactOverride,
    ...jsonOverride,
    ...mdOverride,
    ...typescriptOverride,
    {
      files: ['scripts/**/*.*', 'cli.*'],
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['*.test.ts', '*.test.js', '*.spec.ts', '*.spec.js'],
      rules: {
        'no-unused-expressions': 'off',
        'no-only-tests/no-only-tests': 'error'
      }
    }
  ]
}
