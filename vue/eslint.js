module.exports = {
  'env': {
    'node': true,
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript',
  ],
  'parserOptions': {
    'ecmaVersion': 2020,
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
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
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
