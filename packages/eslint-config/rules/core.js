module.exports = {
  // Layout & Formatting
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: 'return' },
    { blankLine: 'always', prev: '*', next: 'throw' },
    { blankLine: 'always', prev: '*', next: 'break' },
    { blankLine: 'always', prev: '*', next: 'continue' },
    { blankLine: 'always', prev: '*', next: 'for' },
    { blankLine: 'always', prev: '*', next: 'while' },
    { blankLine: 'always', prev: '*', next: 'do' },
    { blankLine: 'always', prev: '*', next: 'switch' },
    { blankLine: 'always', prev: '*', next: 'try' },
    { blankLine: 'always', prev: '*', next: 'class' },
    { blankLine: 'always', prev: '*', next: 'function' },
    // if
    { blankLine: 'always', prev: '*', next: 'if' },
    { blankLine: 'never', prev: 'if', next: 'if' },
    // const
    { blankLine: 'never', prev: 'const', next: 'const' },
    { blankLine: 'any', prev: 'const', next: 'multiline-const' },
    { blankLine: 'any', prev: 'cjs-import', next: 'const' },
    // common
    { blankLine: 'always', prev: 'block-like', next: '*' },
    { blankLine: 'always', prev: '*', next: 'block-like' }
  ],
  'comma-dangle': ['error', 'never'],
  quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
  'array-element-newline': ['error', 'consistent'],
  'array-bracket-newline': ['error', { multiline: true }],
  'function-paren-newline': ['error', 'multiline-arguments'],
  'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
  'sort-imports': [
    'error',
    {
      ignoreCase: false,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      allowSeparatedGroups: false
    }
  ]
}
