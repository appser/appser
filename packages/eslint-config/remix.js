/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['./index.js'],
  settings: {
    react: {
      version: 'detect',
      formComponents: ['Form'],
      linkComponents: [
        {
          name: 'Link',
          linkAttribute: 'to'
        },
        {
          name: 'NavLink',
          linkAttribute: 'to'
        }
      ]
    }
  },
  overrides: [
    {
      files: ['**/routes/**/*.js?(x)', '**/routes/**/*.tsx'],
      rules: {
        // Routes may use default exports without a name. At the route level
        // identifying components for debugging purposes is less of an issue, as
        // the route boundary is more easily identifiable.
        'react/display-name': 'off'
      }
    }
  ]
}
