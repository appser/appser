const typescriptRules = require('../rules/typescript')

module.exports = [
  {
    files: ['**/*.ts?(x)'],
    extends: ['plugin:import/typescript', 'plugin:@typescript-eslint/recommended'],
    /*
    parserOptions: {
      project: './tsconfig.json'
    },
    */
    rules: {
      ...typescriptRules
    }
  },
  {
    files: ['*.d.ts'],
    rules: {
      'import/no-duplicates': 'off'
    }
  }
]
