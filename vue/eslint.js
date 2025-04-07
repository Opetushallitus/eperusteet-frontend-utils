module.exports = {
  'env': {
    'node': true,
    'es2022': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended'
  ],
  'parser': 'vue-eslint-parser',
  'parserOptions': {
    'parser': '@typescript-eslint/parser',
  },
  'rules': {
    'array-bracket-spacing': ['error', 'never'],
    'no-useless-constructor': 'off',
    'operator-linebreak': ['error', 'before'],
    'newline-per-chained-call': 'error',
    'brace-style': ['error', 'stroustrup'],
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
    'no-use-before-define': 'off',
    'no-unused-expressions': 'off',
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    '@typescript-eslint/no-explicit-any': 'off',
    'indent': [
      'error',
      2,
      { 'ignoredNodes': ['PropertyDefinition'] },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'linebreak-style':
      (process.platform === 'win32' ? 0 : [
        'error',
        'unix',
      ]),
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-console': 'error',
    'no-debugger': 'error',
  },
  'overrides': [
    {
      'files': [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      'env': {
        'jest': true,
      },
    },
  ],
};
