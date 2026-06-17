// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import prettier from 'eslint-config-prettier/flat'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  ...tanstackConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      unicorn,
      'unused-imports': unusedImports,
    },
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-method-this-argument': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          checkFilenames: false,
          allowList: { e2e: true },
          replacements: {
            props: false,
            ref: false,
            params: false,
            env: false,
            res: false,
            req: false,
          },
        },
      ],
    },
  },
  prettier,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.tanstack/**',
      'src/routeTree.gen.ts',
      'eslint.config.js',
      'prettier.config.js',
    ],
  },
]
