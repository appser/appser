const reactRules = require('../rules/react')

module.exports = {
  files: ['*.jsx', '*.tsx'],
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
  plugins: ['@studysync/persnickety'],
  rules: {
    ...reactRules
  }
}
