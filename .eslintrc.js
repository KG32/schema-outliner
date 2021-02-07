module.exports = {
  env: {
    browser: true,
    // es2021: true,
    es6: true
  },
  extends: [
    "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    },
  },
  plugins: [
    '@typescript-eslint',
    'plugin:react/recommended'
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'max-len': 'off',
    'import/no-cycle': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': ["error", "WithStatement", "BinaryExpression[operator='in']"],
    '@typescript-eslint/comma-dangle': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
