module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:import/typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'import',
  ],
  rules: {
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["off"],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': [2, { 'props': false }],
    'class-methods-use-this': 'off',
    'lines-between-class-members': [
      'error',
      'always',
      { 'exceptAfterSingleLine': true },
    ]
  },
};
