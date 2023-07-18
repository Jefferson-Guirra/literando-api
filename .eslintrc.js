module.exports = {
    overrides: [
      {
        files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
        extends: 'standard-with-typescript',
        parserOptions: {
          project: './tsconfig.json'
        },
        rules: {
          "@typescript-eslint/prefer-nullish-coalescing": "off",
          "@typescript-eslint/consistent-type-imports": "off",
          "@typescript-eslint/no-invalid-void-type": "off",
          "@typescript-eslint/strict-boolean-expressions": "off",
          "@typescript-eslint/no-misused-promises": "off"
        },
      }
    ],
  }
  