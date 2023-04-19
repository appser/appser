const ymlRules = require('../rules/yml')

module.exports = {
  files: ['*.yaml', '*.yml'],
  extends: ['plugin:yml/standard'],
  rules: {
    'spaced-comment': 'off',
    ...ymlRules
  }
}
