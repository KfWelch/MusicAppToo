module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ["react", "react-native", '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      globalReturn: true,
      impliedStrict: true,
      jsx: true
    }
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'import/prefer-default-export': 0,
        'no-extra-semi': 0,
        'semi': 1,
        'default-case': ['warn'],
        'curly': 'error',
        'dot-notation': 'error',
        'sort-imports': 'warn',
        'no-duplicate-imports': 'error',
        'no-unused-vars': 'warn',
        'no-unused-expressions': 'warn',
        'no-unused-imports': 'warn',
        'jsx-quotes': ['error', 'prefer-double'],
        'quotes': ['error', 'single', { "allowTemplateLiterals": true }]
      },
    },
  ],
};
