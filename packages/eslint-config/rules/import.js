module.exports = {
  'import/first': 'error',
  'import/no-amd': 'error',
  'import/no-webpack-loader-syntax': 'error',
  'import/order': [
    'error',
    {
      'newlines-between': 'always',
      groups: ['builtin', 'external', ['internal', 'parent', 'sibling'], 'index', 'object', 'type'],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }
  ],
  'import/no-duplicates': 'error',
  'import/no-mutable-exports': 'error',
  'import/no-unresolved': 'off',
  'import/no-absolute-path': 'off',
  'import/no-named-as-default-member': 'off',
  'import/no-named-as-default': 'off',
  'import/namespace': 'off'
}
